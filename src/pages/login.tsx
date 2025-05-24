import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logoLibrasLive from "../assets/LibrasLive.png";

import { handleGoogleLogin, loginUser } from "../utils/auth"; // Importa a função de login com Google

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);

  const navigate = useNavigate();

  const googleLogin = async () => {
    setLoading(true);
    try {
      await handleGoogleLogin();
      setSucess("Login com Google bem sucedido!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, senha);
      setSucess("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="min-h-dvh h-screen flex items-center justify-center flex-col lg:flex-row bg-gray-100 lg:px-4  ">
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
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
              <img
                src="/loading.gif"
                alt="Carregando..."
                className="w-16 h-16 mb-2"
              />
              <p className="text-white text-lg font-semibold animate-pulse">
                Carregando...
              </p>
            </div>
          )}
          <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

          {error && (
            <div
              className="p-4 mb-4 text-sm flex flex-col justify-center items-center text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span className="font-medium">
                Erro <br />{" "}
              </span>{" "}
              {error}{" "}
            </div>
          )}
          {sucess && (
            <div
              className="p-4 mb-4 text-sm flex flex-col justify-center items-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span className="font-medium">
                Login concluído com sucesso! <br />{" "}
              </span>{" "}
              {sucess} <br />
              Você será redirecionado em breve.
            </div>
          )}
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
            <p className="font-bold underline"> Cadastre-se </p>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
