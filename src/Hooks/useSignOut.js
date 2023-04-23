import { axiosDefault } from "../Axios.js";
import useAuth from "./useAuth.js";

export default function useSignOut() {
  const { setAuth } = useAuth();

  const signOut = async () => {
    setAuth({});
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
