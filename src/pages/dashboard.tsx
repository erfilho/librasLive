import { handleLogout } from "../utils/logout";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 cursor-pointer bg-white text-black py-2 rounded-full self-center font-medium hover:bg-gray-200 w-1/2 transition"
      >
        Logout
      </button>
    </div>
  );
}
