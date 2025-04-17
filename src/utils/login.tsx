import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

export const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const navigate = useNavigate();
    if (user) {
      navigate("/Dashboard"); // Redireciona para o dashboard após o login
    } else {
      console.log("Erro! Não foi possível fazer login com o Google.");
    }
    // a partir daqui, redirecionamento
  } catch (error) {
    console.log("Erro ao fazer login com Google:", error);
  }
};
