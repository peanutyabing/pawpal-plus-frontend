import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth.js";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {};
  }, []);
}
