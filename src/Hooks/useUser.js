import { useEffect, useContext } from "react";
import UserContext from "../Context/UserProvider.js";
import useAuth from "./useAuth.js";
import useAxiosPrivate from "./useAxiosPrivate.js";

export default function useUser() {
  const { auth } = useAuth();
  const { setUser } = useContext(UserContext);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (auth?.token) {
      loadUserProfile();
    }
  }, [auth]);

  const loadUserProfile = async () => {
    const profile = await axiosPrivate.get("/user-profile", {
      withCredentials: true,
    });
    setUser(profile.data);
  };

  return useContext(UserContext);
}
