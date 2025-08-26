import { transcribeText } from "@/services/speechService";
import { useEffect, useRef, useState } from "react";

const BUFFER_SIZE = 4096;
const TIME_SLICE = 5000; // 5 seg

export const useWavRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");

  const mediaStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processorNode = useRef<ScriptProcessorNode | null>(null);
  const input = useRef<MediaStreamAudioSourceNode | null>(null);
  const bufferChunks = useRef<Float32Array[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Solução alternativa para AudioWorklet que não exige sample rate específico
  const setupAudioProcessing = (context: AudioContext) => {
    processorNode.current = context.createScriptProcessor(BUFFER_SIZE, 1, 1);

    processorNode.current.onaudioprocess = (event) => {
      if (!isRecording) return;
      const inputData = event.inputBuffer.getChannelData(0);
      bufferChunks.current.push(new Float32Array(inputData));
    };

    return processorNode.current;
  };

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
    const dataLength = pcm.length * 2;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // Escreve o cabeçalho WAV
    const writeString = (view: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, audioContext.current?.sampleRate || 44100, true);
    view.setUint32(28, (audioContext.current?.sampleRate || 44100) * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, dataLength, true);

    // Escreve os dados PCM
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
      setChunks((prev) => [...prev, wavBlob]);

      // Envia para transcrição
      const formData = new FormData();
      formData.append("audio", wavBlob, `chunk_${Date.now()}.wav`);

      transcribeText(formData);
    } catch (err) {
      console.error("Error processing chunk:", err);
      setError("Error processing audio chunk");
    }
  };

  const startRecording = async (): Promise<boolean> => {
    if (isRecording) return false;

    try {
      setError(null);
      setChunks([]);
      setAudioUrl("");
      bufferChunks.current = [];

      // Obtém o stream de mídia sem especificar sampleRate
      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Cria o contexto de áudio
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Configura o processamento de áudio
      const processor = setupAudioProcessing(audioContext.current);
      input.current = audioContext.current.createMediaStreamSource(
        mediaStream.current
      );

      // Conecta os nós
      input.current.connect(processor);
      processor.connect(audioContext.current.destination);

      // Inicia o timer para processar chunks
      timer.current = setInterval(flushChunk, TIME_SLICE);

      setIsRecording(true);
      return true;
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        "Failed to start recording. Please check microphone permissions."
      );
      cleanup();
      return false;
    }
  };

  const stopRecording = async (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!isRecording) {
        resolve(new Blob());
        return;
      }

      try {
        if (timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }

        // Processa os últimos chunks
        flushChunk().then(() => {
          const fullBlob =
            chunks.length > 0
              ? new Blob(chunks, { type: "audio/wav" })
              : new Blob();

          if (fullBlob.size > 0) {
            setAudioUrl(URL.createObjectURL(fullBlob));
          }
          resolve(fullBlob);
        });
      } catch (err) {
        console.error("Error stopping recording:", err);
        setError("Failed to stop recording");
        resolve(new Blob());
      } finally {
        cleanup();
        setIsRecording(false);
      }
    });
  };

  const cleanup = (): void => {
    if (processorNode.current) {
      processorNode.current.disconnect();
      processorNode.current = null;
    }

    if (input.current) {
      input.current.disconnect();
      input.current = null;
    }

    if (audioContext.current) {
      if (audioContext.current.state !== "closed") {
        audioContext.current.close().catch(console.error);
      }
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
