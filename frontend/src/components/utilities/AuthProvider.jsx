import { useEffect, useState } from "react";
import { AuthContext } from "./ContextManager";
import { useLocation } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState();
  const [awaitingAuth, setAwaitingAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setAwaitingAuth(true);
    const endpoint = `${import.meta.env.VITE_PATH}/users/auth-status`;
    const handleAuth = async () => {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setIsLoggedIn(data.hasSession);
      setRole(data.role);
      setAwaitingAuth(false);
    };
    handleAuth();
  }, [location]);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setIsLoggedIn, role, awaitingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
