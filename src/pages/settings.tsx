import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";

export default function Settings() {
  return (
    <div className="flex h-screen bg-blue-500">
      {/* Sidebar */}
      <Sidebar />
      {/* Conteúdo principal */}
      <div className="flex-1 p-2 md:ml-16 w-[calc(100% - 4rem)]">
        {/* Botão para abrir a sidebar no mobile */}
        <button className="md:hidden mb-4 text-gray-500">
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Lista das gravações do usuário */}
        <h1 className="text-2xl text-white font-bold mb-4 mt-12">
          {" "}
          Configurações{" "}
        </h1>
      </div>
    </div>
  );
}
