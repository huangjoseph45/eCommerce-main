import { useEffect, useState } from "react";
import { AuthContext } from "./ContextManager";

const AuthProvider = ({ children }) => {
  const [loggedIn, setIsLoggedIn] = useState(getCookie("sessionId") !== null);

  useEffect(() => {
    const checkCookie = () => {
      const hasSession = getCookie("sessionId") !== null;
      setIsLoggedIn(hasSession);
    };

    const interval = setInterval(checkCookie, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

export default AuthProvider;
