import { useRef, useState } from "react";

import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";

interface AudioRecorderProps {
  onSave?: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onSave }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const [mediaStream, setMediaStrem] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [audioURL, setAudioURL] = useState<string | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    setMediaStrem(stream);
    setMediaRecorder(mediaRecorder);

    mediaRecorder.start();
    setIsRecording(true);

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);

      setAudioURL(url);

      if (onSave) {
        onSave(audioBlob);
      }
    };
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {isRecording ? (
        <button
          className="bg-white hover:bg-blue-300 text-black px-4 py-2 rounded flex items-center justify-center gap-2 w-1/6"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          <StopIcon className="h-5 w-5" />
          Parar
        </button>
      ) : (
        <button
          className="bg-white hover:bg-green-300 text-black px-4 py-2 rounded flex items-center justify-center gap-2 w-1/6"
          onClick={startRecording}
        >
          <MicrophoneIcon className="h-5 w-5" />
          Iniciar
        </button>
      )}
      {audioURL && (
        <audio controls src={audioURL} className="w-full max-w-md mt-2" />
      )}
    </div>
  );
}
