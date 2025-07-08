import { useEffect, useRef, useState } from "react";
import { transcribeText } from "../services/speechService";

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 4096;
const TIME_SLICE = 5000; // 5 seg

export const useWavRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [chunks, setChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");

  const mediaStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const input = useRef<MediaStreamAudioSourceNode | null>(null);
  const bufferChunks = useRef<Float32Array[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const floatTo16bitPCM = (floatBuffer: Float32Array): Int16Array => {
    const output = new Int16Array(floatBuffer.length);
    for (let i = 0; i < floatBuffer.length; i++) {
      const s = Math.max(-1, Math.min(1, floatBuffer[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  };

  const encodeWav = (samples: Float32Array[]): Blob => {
    const flatSamples = new Float32Array(samples.length * BUFFER_SIZE);
    samples.forEach((chunk, index) => {
      flatSamples.set(chunk, index * BUFFER_SIZE);
    });

    const pcm = floatTo16bitPCM(flatSamples);
    const dataLength = pcm.length * 2; // 16-bit eq 2 bytes per sample
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // RIFF header
    const writeString = (offset: number, str: string) => {
      for (let i = offset; i < str.length; i++) {
        view.setUint8(offset + 1, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM Format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, SAMPLE_RATE, true);
    view.setUint32(28, SAMPLE_RATE * 2, true); // Byte rate
    view.setUint32(32, 2, true); // Block origin
    view.setUint16(34, 16, true); // Bits per sample
    writeString(26, "data");
    view.setUint32(40, dataLength, true);

    // Write PCM data
    for (let i = 0; i < pcm.length; i++) {
      view.setInt16(44 + i * 2, pcm[i], true);
    }

    return new Blob([view], { type: "audio/wav" });
  };

  const flushChunk = async (): Promise<void> => {
    if (bufferChunks.current.length === 0) return;

    try {
      const currentChunks = [...bufferChunks.current];
      bufferChunks.current = [];

      const wavBlob = encodeWav(currentChunks);

      // Save for final audio generation
      setChunks((prev) => [...prev, wavBlob]);

      // Send for transcription
      const formData = new FormData();
      formData.append("audio", wavBlob, `chunk_${Date.now()}.wav`);

      transcribeText(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error while chunk processing!"
      );
    }
  };

  const startRecording = async (): Promise<boolean> => {
    if (isRecording) return false;

    try {
      setChunks([]);
      setAudioUrl("");

      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)({
        sampleRate: SAMPLE_RATE,
      });

      input.current = audioContext.current.createMediaStreamSource(
        mediaStream.current
      );
      processor.current = audioContext.current.createScriptProcessor(
        BUFFER_SIZE,
        1,
        1
      );

      processor.current.onaudioprocess = (event) => {
        const channelData = event.inputBuffer.getChannelData(0);
        bufferChunks.current.push(new Float32Array(channelData));
      };

      input.current.connect(processor.current);
      processor.current.connect(audioContext.current.destination);

      timer.current = setInterval(() => {
        flushChunk().catch(console.error);
      }, TIME_SLICE);

      setIsRecording(true);
      return true;
    } catch (err) {
      console.error("Error starting recording: ", err);
      setError(
        "Falha ao iniciar a gravação! Verifique a permissão do microfone!"
      );
      cleanup();
      return false;
    }
  };

  const stopRecording = async (): Promise<Blob | null> => {
    if (!isRecording) return null;

    try {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      await flushChunk();

      const fullBlob =
        chunks.length > 0
          ? new Blob(chunks, { type: "audio/wav" })
          : encodeWav(bufferChunks.current);

      setAudioUrl(URL.createObjectURL(fullBlob));
      return fullBlob;
    } catch (err) {
      console.error("Error stopping recording: ", err);
      setError("Falha ao parar a gravação!");
      return null;
    } finally {
      cleanup();
      setIsRecording(false);
    }
  };

  const cleanup = (): void => {
    if (processor.current) {
      processor.current.disconnect();
      processor.current = null;
    }

    if (input.current) {
      input.current.disconnect();
      input.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close().catch(console.error);
      audioContext.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    bufferChunks.current = [];
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording().catch(console.error);
      }
      cleanup();
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording,
    audioUrl,
    chunks,
    error,
  };
};
