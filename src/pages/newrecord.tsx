import Sidebar from "../components/Sidebar";
import AudioRecorder from "../components/AudioRecorder";
import SpeechComponent from "../components/SpeechComponent";

export default function NewRecord() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 bg-blue-500 p-6  text-white grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side */}
        <section className="ml-32 mt-12 px-4">
          <h1 className="text-2xl font-bold mb-2">Nova transcrição</h1>

          <label className="block text-lg font-bold mb-1">
            {" "}
            Título da gravação{" "}
          </label>
          <input
            type="text"
            placeholder="Título da gravação"
            className="w-full rounded-lg p-2 text-black mb-4"
          />

          <AudioRecorder />

          <label className="block text-base italic font-medium mb-1">
            Transcrição
          </label>
          <SpeechComponent />
          <textarea
            className="w-full h-3/5 p-3 text-black rounded-lg bg-blue-300 resize-none"
            placeholder="A transcrição aparecerá aqui..."
          ></textarea>
        </section>

        {/* Right side */}
        <section className="mx-4 mt-12 px-12">
          <h2 className="text-2xl font-bold mb-2">Player vLibras</h2>
          <div className="bg-blue-300 rounded-lg p-4 flex items-center justify-center h-[calc(100%-2rem)]">
            <img
              src="../assets/vlibras-placeholder.png"
              alt="vLibras player"
              className="object-contain max-h-full"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
