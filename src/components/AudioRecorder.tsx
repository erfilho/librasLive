import { useRef, useState, useEffect } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";

interface AudioRecorderProps {
  onSave?: (audioBlob: Blob) => void;
}

interface TranscriptLine {
  time: number; // segundos
  text: string;
}

export default function AudioRecorder({ onSave }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [transcriptList, setTranscriptList] = useState<TranscriptLine[]>([]);
  const recordingStartTime = useRef<number>(0);
  const lastTranscriptRef = useRef<string>("");

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "pt-BR";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex][0].transcript.trim();

        if (result && result !== lastTranscriptRef.current) {
          const timeSinceStart = Math.floor(
            (Date.now() - recordingStartTime.current) / 1000
          );
          setTranscriptList((prev) => [
            ...prev,
            { time: timeSinceStart, text: result },
          ]);
          lastTranscriptRef.current = result;
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Erro no reconhecimento de fala:", event.error);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    setMediaStream(stream);
    setMediaRecorder(mediaRecorder);
    setTranscriptList([]);
    setIsRecording(true);
    recordingStartTime.current = Date.now();

    mediaRecorder.start();
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

    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder?.stop();
    mediaStream?.getTracks().forEach((track) => track.stop());
    recognitionRef.current?.stop();
  };

  const formatTime = (seconds: number) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {isRecording ? (
        <button
          className="bg-white hover:bg-blue-300 text-black px-4 py-2 rounded flex items-center justify-center gap-2 w-1/6"
          onClick={stopRecording}
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
