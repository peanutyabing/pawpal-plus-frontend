import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [trustDevice, setTrustDevice] = useState(
    JSON.parse(localStorage.getItem("trustDevice") || false)
  );

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, trustDevice, setTrustDevice }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
