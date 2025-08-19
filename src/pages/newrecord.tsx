import { LiveTranscription } from "@/components/LiveTranscription";
import AudioRecorder from "../components/AudioRecorder";
import Sidebar from "../components/Sidebar";

import VLibrasPlayer, {
  VLibrasPlayerHandle,
} from "../components/VLibrasPlayer";

import { useRef, useState } from "react";

export default function NewRecord() {
  const playerRef = useRef<VLibrasPlayerHandle>(null);
  const [text, setText] = useState("");

  const handleTranslate = async () => {
    if (!text) {
      alert("Por favor, insira um texto para traduzir.");
      return;
    }

    if (playerRef.current) {
      playerRef.current.translate(text);
    }
  };

  const handleTestvLibras = () => {
    if (playerRef.current) {
      playerRef.current.translate(text);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="flex flex-row p-6 text-white bg-blue-500 w-dvw">
        {/* Left side */}
        <div className="w-1/2 px-4 mt-12 ml-16">
          <h1 className="mb-2 text-2xl font-bold">Nova transcrição</h1>
          <LiveTranscription />
          <AudioRecorder />
          {/* Remove this after works */}
          <textarea
            className="w-full p-2 text-black border bg-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite seu texto aqui"
          />
          <button
            onClick={handleTranslate}
            className="px-4 py-2 mx-2 mt-2 text-white bg-green-600"
          >
            Traduzir com VLibras
          </button>
          <button
            onClick={handleTestvLibras}
            className="px-4 py-2 mx-2 mt-2 text-white bg-green-600"
          >
            Testar o VLibras
          </button>
        </div>

        {/* Right side */}
        <div className="w-1/2 px-12 mx-4 mt-12">
          <h2 className="mb-2 text-2xl font-bold">Player vLibras</h2>
          <VLibrasPlayer ref={playerRef} />
        </div>
      </div>
    </div>
  );
}
