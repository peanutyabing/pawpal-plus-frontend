import { useEffect } from "react";
import { axiosPrivate } from "../Axios.js";
import useRefreshToken from "./useRefreshToken.js";
import useAuth from "./useAuth.js";

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  // Attach and remove axios interceptors
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          // If this is the first attempt to intercept, put token into headers
          config.headers["Authorization"] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (err) => {
        Promise.reject(err);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevReq = err?.config;
        if (err?.response?.status === 403 && !prevReq.sent) {
          prevReq.sent = true;
          const newToken = await refresh();
          prevReq.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosPrivate(prevReq);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}
