import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

export default function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
}
