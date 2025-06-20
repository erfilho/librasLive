import { useRef, useState, useEffect } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import {
  saveTranscription,
  uploadAudioFile,
} from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";
import { Timestamp } from "firebase/firestore";
import { AlertsPopups } from "./AlertsPopups";

interface AudioRecorderProps {
  onSave?: (audioBlob: Blob) => void;
}

interface TranscriptLine {
  time: number; // segundos
  text: string;
}

export default function AudioRecorder({ onSave }: AudioRecorderProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [recordingDuration, setRecordingDuration] = useState(0);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleError = (error: string) => {
    console.error("Erro:", error);
    setError(error);
  };

  // Função para traduzir o texto, utilizando a API da Web
  const translateText = async (text: string): Promise<string> => {
    const response = await fetch("https://libraslive.onrender.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    const translation: string = data.translation;

    return translation;
  };

  const [translatedTranscriptList, setTranslatedTranscriptList] = useState<
    { time: number; original: string; translated: string }[]
  >([]);

  const [transcriptList, setTranscriptList] = useState<TranscriptLine[]>([]);
  const recordingStartTime = useRef<number>(0);

  // Visualização de duração do áudio enquanto está sendo gravado
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const handleChunck = async (chunk: Blob) => {
    audioChunksRef.current.push(chunk);

    const formData = new FormData();

    formData.append("audio", chunk, "chunk.wav");

    try {
      const res = await fetch("https://libraslive.onrender.com/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const timeSinceStart = Math.floor(
        (Date.now() - recordingStartTime.current) / 1000
      );

      const transcript = data.transcription;

      if (transcript) {
        setTranscriptList((prev) => [
          ...prev,
          { time: timeSinceStart, text: transcript },
        ]);
      }

      const translated = await translateText(transcript);

      setTranslatedTranscriptList((prev) => [
        ...prev,
        {
          time: timeSinceStart,
          original: transcript,
          translated,
        },
      ]);
    } catch (err) {
      handleError(`Erro durante a transcrição: ${err}`);
    }
  };

  // Função para iniciar a gravação do áudio
  const startRecording = async () => {
    if (title === "") {
      setError("Por favor, insira um título para a gravação.");
      return;
    } else {
      setError(null);
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/wav",
    });

    setMediaStream(stream);
    setMediaRecorder(mediaRecorder);

    setTranscriptList([]);
    setTranslatedTranscriptList([]);

    setIsRecording(true);

    setRecordingDuration(0);

    recordingStartTime.current = Date.now();

    mediaRecorder.start(5000);

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        handleChunck(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      console.log(`prim ${transcriptList}`);
      console.log(`seg ${translatedTranscriptList}`);

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      if (onSave) {
        onSave(audioBlob);
      }
    };
  };

  // Função para salvar a transcrição no Firestore
  const handleSave = async (
    audioUrl: string,
    classRef: string,
    duration: number,
    filename: string,
    originalTranscriptList: {
      time: number;
      original: string;
      translated: string;
    }[]
  ) => {
    if (!user) return;

    const transcription = originalTranscriptList
      .map((line) => `[${formatTime(line.time)}] ${line.original}`)
      .join("\n");

    const translation = originalTranscriptList
      .map((line) => `[${formatTime(line.time)}] ${line.translated}`)
      .join("\n");

    setIsSaving(true);
    setError(null);

    await saveTranscription({
      userId: user.uid,
      audioUrl,
      classRef,
      duration: formatTime(duration),
      filename,
      transcription,
      translated: translation,
      createdAt: Timestamp.now(),
    });

    setIsSaving(false);
  };

  // Função para salvar a transcrição após finalização da gravação
  const stopRecording = async () => {
    setIsRecording(false);

    setError(null);

    mediaRecorder?.stop();
    mediaStream?.getTracks().forEach((track) => track.stop());

    // Atualizando o nome do arquivo de acordo com o uuid do usuário e o timestamp atual
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const filename = `${user?.uid}_${Date.now()}.wav`;

    // Salvando a duração do áudio
    const durationSeconds = Math.floor(
      (Date.now() - recordingStartTime.current) / 1000
    );

    // Utilizando a função handleSave para salvar no Firestore
    try {
      const audioUrl = await uploadAudioFile(audioBlob, filename);
      const classRef = title;

      await handleSave(
        audioUrl,
        classRef,
        durationSeconds,
        filename,
        translatedTranscriptList
      );
    } catch (err) {
      handleError(`Erro ao salvar a gravação: ${err}`);
    }
  };

  // Função para formatar o timestamp do áudio
  const formatTime = (seconds: number) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Mensagens de erro e salvamento */}
      {error && <AlertsPopups title="Erro" type="error" message={error} />}

      {isSaving && (
        <AlertsPopups
          title="Salvando Gravação"
          type="info"
          message="Aguarde enquanto a gravação está sendo salva."
        />
      )}

      <label className="block text-lg font-bold mb-1">
        {" "}
        Título da gravação{" "}
      </label>
      <input
        type="text"
        placeholder="Título da gravação"
        className="w-full rounded-lg p-2 text-black mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex items-center justify-start gap-2 mb-4 w-full">
        {isRecording ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <button
              className="bg-white hover:bg-red-300 text-black px-4 py-2 rounded flex items-center justify-center gap-2 w-1/4"
              onClick={stopRecording}
            >
              <StopIcon className="h-5 w-5" />
              Parar
            </button>
            <p className="text-lg font-mono text-slate-100">
              Duração: {formatTime(recordingDuration)}
            </p>
          </div>
        ) : (
          <button
            className="bg-white hover:bg-green-300 text-black px-4 py-2 rounded flex items-center justify-center gap-2 w-1/4"
            onClick={startRecording}
          >
            <MicrophoneIcon className="h-5 w-5" />
            Iniciar
          </button>
        )}
      </div>

      {audioURL && (
        <audio controls src={audioURL} className="w-full max-w-md mt-2" />
      )}

      {transcriptList.length > 0 && (
        <div className="bg-blue-300  rounded py-1 px-4 max-w-3/4 h-3/5">
          <h3 className="text-lg font-semibold mb-2">Transcrição:</h3>
          <ul className="space-y-1 text-gray-700 text-md">
            {transcriptList.map((line, index) => (
              <li key={index}>
                <span className="font-mono text-blue-700">
                  [{formatTime(line.time)}]
                </span>{" "}
                {line.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
