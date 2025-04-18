import Sidebar from "../components/Sidebar";

export default function NewRecord() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 bg-blue-500 p-6 text-white grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h1 className="text-2xl font-bold mb-2">Nova transcrição</h1>

          <label className="block text-sm mb-1">Título da gravação</label>
          <input
            type="text"
            placeholder="Título da gravação"
            className="w-full rounded-lg p-2 text-black mb-4"
          />

          <div className="flex gap-4 mb-6">
            <button className="bg-gray-200 text-black px-4 py-2 rounded flex items-center gap-2">
              🎙 Iniciar
            </button>
            <button className="bg-gray-200 text-black px-4 py-2 rounded flex items-center gap-2">
              ⏸ Pausar
            </button>
            <button className="bg-gray-200 text-black px-4 py-2 rounded flex items-center gap-2">
              ⏹ Parar
            </button>
          </div>

          <label className="block text-sm mb-1">Transcrição</label>
          <textarea
            className="w-full h-64 p-3 text-black rounded-lg bg-blue-300 resize-none"
            placeholder="A transcrição aparecerá aqui..."
          ></textarea>
        </section>

        <section>
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
