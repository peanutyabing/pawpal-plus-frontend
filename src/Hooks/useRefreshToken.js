import useAuth from "./useAuth";
import axios from "axios";
import { BACKEND_URL } from "../Constants.js";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get(`${BACKEND_URL}/auth/refresh`, {
      withCredentials: true,
    });

    setAuth((prevState) => {
      return { ...prevState, token: response.data.token };
    });

    return response.data.token;
  };

  return refresh;
}
