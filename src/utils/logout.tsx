import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export const handleLogout = async () => {
  try {
    await signOut(auth);
    const navigate = useNavigate();
    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};
