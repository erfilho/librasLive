import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="absolute inset-0 bg-blue-500 flex flex-col items-center justify-center z-10">
        <img
          src="/loading.gif"
          alt="Carregando..."
          className="w-16 h-16 mb-2"
        />
        <p className="text-white text-lg font-semibold animate-pulse">
          Carregando...
        </p>
      </div>
    );

  return user ? children : <Navigate to="/login" replace />;
}
