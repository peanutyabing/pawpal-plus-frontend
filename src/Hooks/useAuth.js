import { useContext } from "react";
import AuthContext from "../Context/AuthProvider.js";

export default function useAuth() {
  return useContext(AuthContext);
}
