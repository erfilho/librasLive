import Sidebar from "../components/Sidebar";
import AudioRecorder from "../components/AudioRecorder";
import VLibrasPlayer, {
  VLibrasPlayerHandle,
} from "../components/VLibrasPlayer";

import { useRef, useState } from "react";

export default function NewRecord() {
  const playerRef = useRef<VLibrasPlayerHandle>(null);
  const [text, setText] = useState("");

  const handleTranslate = () => {
    if (playerRef.current) {
      playerRef.current.translate(text);
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="flex flex-row bg-blue-500 p-6 text-white w-dvw">
        {/* Left side */}
        <div className="ml-16 mt-12 px-4 w-1/2">
          <h1 className="text-2xl font-bold mb-2">Nova transcrição</h1>

          <AudioRecorder />
          <textarea
            className="border w-full p-2 text-black"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite seu texto aqui"
          />
          <button
            onClick={handleTranslate}
            className="mt-2 px-4 py-2 bg-green-600 text-white"
          >
            Traduzir com VLibras
          </button>
        </div>

        {/* Right side */}
        <div className="mx-4 mt-12 px-12 w-1/2">
          <h2 className="text-2xl font-bold mb-2">Player vLibras</h2>
          <VLibrasPlayer ref={playerRef} />
        </div>
      </div>
    </div>
  );
}
