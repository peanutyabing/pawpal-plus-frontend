import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../Hooks/useRefreshToken.js";
import useAuth from "../Hooks/useAuth.js";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, trustDevice } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.token ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>
      {!trustDevice ? (
        <Outlet />
      ) : isLoading ? (
        <div className="App">
          <header className="App-header">
            <div>Loading...</div>
          </header>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
