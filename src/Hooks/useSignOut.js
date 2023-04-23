import { axiosDefault } from "../Axios.js";
import useAuth from "./useAuth.js";
import { useContext } from "react";
import UserContext from "../Context/UserProvider.js";

export default function useSignOut() {
  const { setAuth } = useAuth();
  const { setUser } = useContext(UserContext);

  const signOut = async () => {
    setAuth({});
    setUser({});
    try {
      await axiosDefault.get("/auth/sign-out", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return signOut;
}
