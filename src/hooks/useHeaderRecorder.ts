import { useEffect, useRef, useState } from "react";
import { transcribeText } from "../services/speechService";

const TIME_SLICE = 5000; // 5s
const MIME_TYPE = "audio/webm; codecs=opus";

export const useHeaderRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const [audioUrl, setAudioURL] = useState("");

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const headerBufRef = useRef<ArrayBuffer | null>(null);

  const sendChunk = async (blob: Blob) => {
    const form = new FormData();

    form.append("audio", blob, "chunk.webm");

    transcribeText(form);
  };

  const startRecording = async () => {
    if (isRecording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.current = stream;

    mediaRecorder.current = new MediaRecorder(stream, { mimeType: MIME_TYPE });

    mediaRecorder.current.ondataavailable = async (event) => {
      if (!event.data || event.data.size === 0) return;

      if (!headerBufRef.current) {
        headerBufRef.current = await event.data.arrayBuffer();
        setAudioChunks((prev) => [...prev, event.data]);
        return;
      }

      // BUG: sempre o chunk irá com o primeiro áudio de 5s
      const combined = new Blob([headerBufRef.current, event.data]);

      await sendChunk(combined);
    };

    mediaRecorder.current.start(TIME_SLICE);
    setIsRecording(true);
  };

  const stopRecording = (): Promise<Blob> =>
    new Promise((resolve) => {
      if (!isRecording || !mediaRecorder.current) {
        resolve(new Blob());
        return;
      }

      mediaRecorder.current.onstop = () => {
        const fullBlob = new Blob(audioChunks, { type: MIME_TYPE });

        const url = URL.createObjectURL(fullBlob);
        setAudioURL(url);

        setAudioChunks([]);

        headerBufRef.current = null;

        resolve(fullBlob);
      };

      mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach((track) => track.stop());

      setIsRecording(false);
    });

  useEffect(() => {
    return () => {
      if (mediaRecorder.current?.state === "recording")
        mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording,
    audioChunks,
    audioUrl,
  };
};
