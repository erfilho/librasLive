import RecordingsList from "@/components/recordings/RecordingsList";
import Sidebar from "@/components/ui/Sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-blue-500">
      {/* Sidebar */}
      <Sidebar />
      {/* Conteúdo principal */}
      <div className="flex-1 p-2 md:ml-16 w-[calc(100% - 4rem)]">
        {/* Botão para abrir a sidebar no mobile */}
        <button className="mb-4 text-gray-500 md:hidden">
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Lista das gravações do usuário */}
        <h1 className="mt-12 mb-4 text-2xl font-bold text-white">
          {" "}
          Minhas gravações{" "}
        </h1>
        <RecordingsList />
      </div>
    </div>
  );
}
