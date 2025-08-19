import { createRealtimeTranscriptionSession } from "@/lib/actions";
import { RealtimeClient } from "@/lib/openai-realtime/client/RealtimeClient";
import {
  AudioFormat,
  ServerEvent,
  ServerEventType,
  TranscriptionModel,
  TranscriptionSessionConfig,
  TurnDetectionType,
} from "@/lib/openai-realtime/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNotification } from "../context/notifications/useNotification";

import { AlertsPopups } from "./AlertsPopups";

const defaultTranscriptionConfig: TranscriptionSessionConfig = {
  turn_detection: {
    type: TurnDetectionType.SERVER_VAD,
  },
  input_audio_transcription: {
    model: TranscriptionModel.GPT4O_TRANSCRIBE,
    language: "pt",
  },
  input_audio_format: AudioFormat.PCM16,
};

interface EventLogItem {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export function LiveTranscription() {
  const [transcriptionConfig] = useState<TranscriptionSessionConfig>(
    defaultTranscriptionConfig
  );
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const { handleError, handleObs, handleSucess } = useNotification();

  const [events, setEvents] = useState<EventLogItem[]>([]);

  const [connected, setConnected] = useState(false);

  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [transcriptionHistory, setTranscriptionHistory] = useState<
    Array<{
      id: string;
      text: string;
      timestamp: Date;
    }>
  >([]);

  const clientRef = useRef<RealtimeClient | null>(null);

  // Adding events to log
  const addEvent = useCallback(
    (type: string, data: Record<string, unknown>) => {
      setEvents((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type,
          data,
          timestamp: new Date(),
        },
      ]);
    },
    []
  );

  // Creates a client when clientSecret changes
  useEffect(() => {
    let cancelled = false;

    if (!clientSecret) {
      clientRef.current = null;
      return;
    }

    if (clientRef.current) {
      clientRef.current.disconnect();
    }

    const client = new RealtimeClient({
      clientSecret,
      realtimeUrl:
        import.meta.env.NEXT_PUBLIC_OPENAI_REALTIME_WEBRTC_URL ||
        "https://api.openai.com/v1/realtime",
      sessionType: "transcription",

      // Speaker-specific transcript callbacks
      onUserTranscriptDelta: (text: string) => {
        addEvent("user_transcription_done", { text });
      },
      onUserTranscriptDone: (text: string) => {
        setCurrentTranscript(""); // Cleaning live transript
        setTranscriptionHistory((prev) => [
          ...prev,
          {
            id: `transcript-${Date.now()}`,
            text,
            timestamp: new Date(),
          },
        ]);
      },
      onTranscriptionError: (error: Error) => {
        addEvent("transcription_error", { error: error.message });
      },
      onConnectionStateChange: (state) => {
        setConnected(state === "connected");
        handleSucess("Conexão bem sucedida!", "Conectado ao servidor!");
        addEvent("conection_state_change", { state });
      },
      onError: (err) => {
        handleError(err);
        addEvent(ServerEventType.ERROR, { error: err.message });
      },
      // Raw event acess for debugging
      onRawEvent: (event: ServerEvent) => {
        addEvent(event.type, {
          event_id: event.event_id,
          data: event,
        });
      },
    });
    clientRef.current = client;

    // Auto connect
    const connectClient = async () => {
      try {
        await clientRef.current!.connect();
        if (!cancelled) addEvent("client_connected", {});
      } catch (err) {
        if (!cancelled)
          addEvent(ServerEventType.ERROR, {
            error: err instanceof Error ? err.message : "Unknown error",
          });
      }
    };
    connectClient();

    return () => {
      cancelled = true;
      client.disconnect();
    };
  }, [clientSecret]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  // Handle session creation using server acion
  const handleCreateSession = async () => {
    try {
      setIsCreatingSession(true);
      handleObs("Aguarde enquanto a conexão é feita!", "Conectando ao servidor!");

      addEvent("session_creating", {
        config: transcriptionConfig,
        type: "transcription",
      });

      const result =
        await createRealtimeTranscriptionSession(transcriptionConfig);

      if (result.success && result.clientSecret) {
        setClientSecret(result.clientSecret);
        addEvent(ServerEventType.SESSION_CREATED, {
          sessionId: result.sessionId,
          config: result.config,
          sessionType: "transcription",
        });
      } else {
        throw new Error(result.error || "Failed to create session");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      handleError(error);
      addEvent(ServerEventType.ERROR, { error: error.message });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDisconnect = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
    setClientSecret("");
    setConnected(false);
    addEvent("client_disconnected", {});
  };

  const handleClearHistory = () => {
    setTranscriptionHistory([]);
    setCurrentTranscript("");
    addEvent("history_cleared", {});
  };

  useEffect(() => {
    if (transcriptionConfig && !connected) {
      handleCreateSession();
    }
  }, [transcriptionConfig, connected]);

  return (
    <div>
      <p> This is the LiveTranscription module, and it's not working right now!</p>
    </div>
  );
}
