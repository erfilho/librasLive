import { useRef, useState, useEffect } from "react";

import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import {
  saveTranscription,
  uploadAudioFile,
} from "../services/firestoreService";

import { useAuth } from "../context/AuthContext";

import { Timestamp } from "firebase/firestore";

import { useNotification } from "../context/notifications/useNotification";

import { formatTime } from "../utils/format";

import { AlertsPopups } from "./AlertsPopups";

import { useWavRecorder } from "../hooks/useWavRecorder";

interface TranscriptLine {
  time: number; // segundos
  text: string;
}

export default function AudioRecorder() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const { handleError } = useNotification();

  const {
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    isRecording,
    audioUrl,
  } = useWavRecorder();

  const [recordingDuration, setRecordingDuration] = useState(0);

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

  // Função para iniciar a gravação do áudio
  const startRecording = async () => {
    if (title === "") {
      handleError("Por favor, insira um título para a gravação.");
      return;
    }

    setTranscriptList([]);

    setTranslatedTranscriptList([]);

    setRecordingDuration(0);

    recordingStartTime.current = Date.now();

    await startAudioRecording();
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
    try {
      // Atualizando o nome do arquivo de acordo com o uuid do usuário e o timestamp atual
      const filename = `${user?.uid}_${Date.now()}.ogg`;

      // Salvando a duração do áudio
      const durationSeconds = Math.floor(
        (Date.now() - recordingStartTime.current) / 1000
      );

      // Parar a gravação e obter o blob do áudio
      const audioBlob = await stopAudioRecording();

      // Upload do audio, considerando a existencia do uploadAudioFile
      const uploadAudioURL = await uploadAudioFile(audioBlob, filename);

      // Utilizando a função handleSave para salvar no Firestore
      const classRef = title;

      await handleSave(
        uploadAudioURL,
        classRef,
        durationSeconds,
        filename,
        translatedTranscriptList
      );
    } catch (err) {
      handleError(`Erro ao salvar a gravação: ${err}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {isSaving && (
        <AlertsPopups
          title="Salvando Gravação"
          type="info"
          message="Aguarde enquanto a gravação está sendo salva."
        />
      )}

      <label className="block mb-1 text-lg font-bold">
        {" "}
        Título da gravação{" "}
      </label>
      <input
        type="text"
        placeholder="Título da gravação"
        className="w-full p-2 mb-4 text-black rounded-lg"
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex items-center justify-start w-full gap-2 mb-4">
        {isRecording ? (
          <div className="flex items-center justify-between w-full gap-2">
            <button
              className="flex items-center justify-center w-1/4 gap-2 px-4 py-2 text-black bg-white rounded hover:bg-red-300"
              onClick={stopRecording}
            >
              <StopIcon className="w-5 h-5" />
              Parar
            </button>
            <p className="font-mono text-lg text-slate-100">
              Duração: {formatTime(recordingDuration)}
            </p>
          </div>
        ) : (
          <button
            className="flex items-center justify-center w-1/4 gap-2 px-4 py-2 text-black bg-white rounded hover:bg-green-300"
            onClick={startRecording}
          >
            <MicrophoneIcon className="w-5 h-5" />
            Iniciar
          </button>
        )}
      </div>

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full max-w-md mt-2" />
      )}

      {transcriptList.length > 0 && (
        <div className="px-4 py-1 bg-blue-300 rounded max-w-3/4 h-3/5">
          <h3 className="mb-2 text-lg font-semibold">Transcrição:</h3>
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
