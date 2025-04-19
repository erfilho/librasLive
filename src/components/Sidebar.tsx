import {
  Cog6ToothIcon,
  PowerIcon,
  XMarkIcon,
  FolderIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import logoLibrasLive from "../assets/LibrasLive.png";
import { logoutSample } from "../utils/logout";
import { useState } from "react";

import { Link } from "react-router-dom";

import { JSX } from "react";

export default function Sidebar() {
  const handleLogout = logoutSample();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      <aside
        className={`bg-white w-64 p-4 space-y-4 shadow-lg fixed top-0 left-0 h-full transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative z-50`}
      >
        <div className="flex items-center justify-center mb-2">
          <img
            src={logoLibrasLive}
            alt="LibrasLive Logo"
            className="w-36 lg:w-32 h-36 lg:h-32 mb-4"
          />
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <Link to="/dashboard">
            <SidebarItem
              icon={<FolderIcon className="h-5 w-5" />}
              label="Minhas Gravações"
            />
          </Link>

          <Link to="/newrecord">
            <SidebarItem
              icon={<MicrophoneIcon className="h-5 w-5" />}
              label="Nova transcrição"
            />
          </Link>

          <Link to="/settings">
            <SidebarItem
              icon={<Cog6ToothIcon className="h-5 w-5" />}
              label="Configurações"
            />
          </Link>

          <SidebarItem
            icon={<PowerIcon className="h-5 w-5" />}
            label="Sair"
            onClick={handleLogout}
          />
        </nav>
      </aside>
      ;
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700 w-full text-left"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
