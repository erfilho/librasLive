import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { useGoogleLogin } from "../utils/login";
import logoLibrasLive from "../assets/LibrasLive.png";
import { Link } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const googleLogin = useGoogleLogin();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    console.log("Cadastro com:", { nome, email, senha });
    // Aqui você pode chamar a função de cadastro da sua API
  };

  return (
    <div className="min-h-dvh h-screen flex items-center justify-center flex-col lg:flex-row bg-gray-100 lg:px-4">
      {/* Left side */}
      <div className="lg:w-1/2 w-full lg:h-full h-1/4 flex items-center justify-center">
        <div className="lg:h-1/2 h-full lg:w-3/5 xl:w-3/5 w-full !bg-sky-400 flex flex-col items-center justify-center lg:p-0 p-10 lg:rounded-3xl shadow-2xl">
          <img
            src={logoLibrasLive}
            alt="LibrasLive Logo"
            className="w-48 lg:w-64 h-48 lg:h-64 mb-4"
          />
          <h1 className="text-xl font-normal italic hidden lg:flex text-gray-800">
            Transcrição em tempo real para Libras
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="lg:w-1/2 w-full lg:h-full h-3/4 flex items-center justify-center">
        <div className="lg:w-3/4 xl:w-3/5 w-full lg:h-3/4 h-full bg-blue-500 text-white p-10 lg:rounded-3xl flex flex-col justify-center shadow-2xl">
          <h2 className="text-3xl font-semibold text-center mb-6">Cadastro</h2>
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <input
              type="text"
              placeholder="Nome"
              className="px-4 py-2 rounded-lg bg-blue-400 w-3/4 placeholder-white focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirmar Senha"
              className="px-4 py-2 rounded-lg bg-blue-400 w-3/4 placeholder-white focus:outline-none"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-cyan-300 text-blue-900 py-2 rounded-lg font-bold hover:bg-cyan-200 transition w-1/3"
            >
              Cadastrar
            </button>
          </form>

          <div className="my-6 border-t w-4/5 self-center border-white opacity-50"></div>

          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 cursor-pointer bg-white text-black py-2 rounded-full self-center font-medium hover:bg-gray-200 xl:w-2/3 md:w-4/5 sm:w-full transition"
          >
            <FcGoogle className="text-xl" />
            Cadastro com Google
          </button>

          <p className="mt-4 text-center">
            Já tem conta?{" "}
            <Link to="/" className="font-bold underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
