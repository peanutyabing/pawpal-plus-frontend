import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../Hooks/useRefreshToken.js";
import useAuth from "../Hooks/useAuth.js";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
}