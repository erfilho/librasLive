import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { useGoogleLogin } from "../utils/login"; // Importa a função de login com Google

import logoLibrasLive from "../assets/LibrasLive.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const googleLogin = useGoogleLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login com:", email, senha);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Redirecionar para cadastro");
  };

  return (
    <div className="min-h-dvh h-screen flex items-center justify-center flex-col lg:flex-row bg-gray-100 lg:px-4  ">
      {/* Right side */}
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

      {/* Left side */}
      <div className="lg:w-1/2 w-full lg:h-full h-3/4 flex items-center justify-center">
        <div className="lg:w-3/4 xl:w-3/5 w-full lg:h-3/4 h-full bg-blue-500 text-white p-10 lg:rounded-3xl flex flex-col justify-center shadow-2xl">
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
              className="bg-cyan-300 cursor-pointer text-blue-900 py-2 rounded-lg font-bold hover:bg-cyan-200 transition w-1/3"
            >
              Entrar
            </button>
          </form>

          <div className="my-6 border-t w-4/5 self-center border-white opacity-50"></div>

          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 cursor-pointer bg-white text-black py-2 rounded-full self-center font-medium hover:bg-gray-200 xl:w-1/2 md:w-2/4 sm:w-3/4 transition"
          >
            <FcGoogle className="text-xl" />
            Login com Google
          </button>

          <button
            onClick={handleRegister}
            className="flexflex-row items-center justify-center gap-2 self-center cursor-pointer text-white py-2 font-medium w-full"
          >
            <p> Ainda não tem conta ?</p>{" "}
            <p className="font-bold underline">
              {" "}
              <Link to={"/Register"}> Cadastre-se </Link>{" "}
            </p>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
