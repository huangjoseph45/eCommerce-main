import { useEffect, useState } from "react";
import { AuthContext } from "./ContextManager";
import { useSearchParams } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [loggedIn, setIsLoggedIn] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
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
    };
    handleAuth();
  }, [window.location]);

  return (
    <AuthContext.Provider value={{ loggedIn, setIsLoggedIn, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
