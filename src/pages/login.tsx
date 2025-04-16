import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import logoLibrasLive from "../assets/LibrasLive.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login com:", email, senha);
  };

  const handleGoogleLogin = () => {
    console.log("Login com Google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full">
        {/* Lado esquerdo - Logo */}
        <div className="bg-sky-400 flex flex-col items-center justify-center p-10 w-full md:w-1/2">
          <img
            src={logoLibrasLive}
            alt="LibrasLive Logo"
            className="w-48 h-48 mb-4"
          />
          <h1 className="text-xl font-normal italic text-gray-800">
            Transcrição em tempo real para Libras
          </h1>
        </div>

        {/* Lado direito - Formulário */}
        <div className="bg-blue-500 text-white p-10 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-lg bg-blue-400 w-3/4 placeholder-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="px-4 py-2 rounded-lg bg-blue-400 w-3/4 placeholder-white focus:outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-cyan-300 cursor-pointer text-blue-900 py-2 rounded-lg font-bold hover:bg-cyan-200 transition w-1/2"
            >
              Entrar
            </button>
          </form>

          <div className="my-6 border-t w-4/5 self-center border-white opacity-50"></div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 cursor-pointer bg-white text-black py-2 rounded-full self-center font-medium hover:bg-gray-200 w-1/2 transition"
          >
            <FcGoogle className="text-xl" />
            Login com Google
          </button>
        </div>
      </div>
    </div>
  );
}
