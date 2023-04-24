import useAuth from "./useAuth.js";
import { axiosDefault } from "../Axios.js";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosDefault.get("/auth/refresh", {
      withCredentials: true,
    });

    setAuth((prevState) => {
      return { ...prevState, token: response.data.token };
    });

    return response.data.token;
  };

  return refresh;
}
