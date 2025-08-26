import logoLibrasLive from "@/assets/LibrasLive.png";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { useNotification } from "@/context/notifications/useNotification";

import { handleGoogleLogin, loginUser } from "@/utils/auth";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);

  const { handleError, handleSucess } = useNotification();

  const navigate = useNavigate();

  const googleLogin = async () => {
    setLoading(true);
    try {
      await handleGoogleLogin();
      handleSucess("Login com Google bem sucedido!", "Sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(email, senha);
      handleSucess("Você será redirecionado em breve!", "Login bem sucedido!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 min-h-dvh lg:flex-row lg:px-4 ">
      {/* Left side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 lg:h-full h-1/4">
        <div className="lg:h-1/2 h-full lg:w-3/5 xl:w-3/5 w-full bg-sky-400! flex flex-col items-center justify-center lg:p-0 p-10 lg:rounded-3xl shadow-2xl">
          <img
            src={logoLibrasLive}
            alt="LibrasLive Logo"
            className="w-48 h-48 mb-4 lg:w-64 lg:h-64"
          />
          <h1 className="hidden text-xl italic font-normal text-gray-800 lg:flex">
            Transcrição em tempo real para Libras
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center w-full lg:w-1/2 lg:h-full h-3/4">
        <div className="flex flex-col justify-center w-full h-full p-10 text-white bg-blue-500 shadow-2xl lg:w-3/4 xl:w-3/5 lg:h-3/4 lg:rounded-3xl">
          {/* Exibe o carregamento enquanto aguarda a resposta do servidor */}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <img
                src="/loading.gif"
                alt="Carregando..."
                className="w-16 h-16 mb-2"
              />
              <p className="text-lg font-semibold text-white animate-pulse">
                Carregando...
              </p>
            </div>
          )}

          <h2 className="mb-6 text-3xl font-semibold text-center">Login</h2>

          {/* Formulário de login */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-3/4 px-4 py-2 placeholder-white bg-blue-400 rounded-lg focus:outline-hidden"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-3/4 px-4 py-2 placeholder-white bg-blue-400 rounded-lg focus:outline-hidden"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-1/3 py-2 font-bold text-blue-900 transition rounded-lg cursor-pointer bg-cyan-300 hover:bg-cyan-200"
            >
              Entrar
            </button>
          </form>

          {/* Divisor */}
          <div className="self-center w-4/5 my-6 border-t border-white opacity-50"></div>

          {/* Botões de login */}
          <button
            onClick={googleLogin}
            className="flex items-center self-center justify-center gap-2 py-2 font-medium text-black transition bg-white rounded-full cursor-pointer hover:bg-gray-200 xl:w-1/2 md:w-2/4 sm:w-3/4"
          >
            <FcGoogle className="text-xl" />
            Login com Google
          </button>

          <button
            onClick={handleRegister}
            className="items-center self-center justify-center w-full gap-2 py-2 font-medium text-white cursor-pointer flexflex-row"
          >
            <p> Ainda não tem conta ?</p>{" "}
            <p className="font-bold underline"> Cadastre-se </p>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
