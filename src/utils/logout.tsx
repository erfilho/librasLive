import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export const logoutSample = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return handleLogout;
};
