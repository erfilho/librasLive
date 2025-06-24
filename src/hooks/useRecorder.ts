import { useEffect, useRef, useState } from "react";

const TIME_SLICE = 5000;

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [audioUrl, setAudioURL] = useState<String | null>(null);

  const CHUNK_DURATION = 5000;

  const startRecording = async () => {
    try {
      if (isRecording) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/ogg; codecs=opus",
        audioBitsPerSecond: 64000, //64 kbps
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);

          // manda o chunk para o backend
          // sendtoBack(event.data)
        }
      };

      mediaRecorder.current.start(CHUNK_DURATION);
      setIsRecording(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao acessar o microfone!"
      );
    }
  };

  const stopRecording = async (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!isRecording || !mediaRecorder.current) return;

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/ogg" });

        resolve(audioBlob);

        setAudioChunks([]);

        const url = URL.createObjectURL(audioBlob);

        setAudioURL(url);
      };

      mediaRecorder.current.stop();

      mediaStream.current?.getTracks().forEach((track) => track.stop());

      setIsRecording(false);
    });
  };
};
