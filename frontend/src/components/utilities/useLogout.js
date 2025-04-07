import { useState, useContext } from "react";
import { ProductContext } from "./ContextManager";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [loading, setIsLoading] = useState(false);
  const [result, setResult] = useState(false);
  const { setUserInfo } = useContext(ProductContext);
  const nav = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setResult(true);
      setUserInfo({});
      nav("/");
    } catch (error) {
      document.cookie.split(";").forEach(function (cookie) {
        let cookieName = cookie.split("=")[0].trim();
        document.cookie =
          cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      });
      setResult(false);
      console.error("Logout Error: ", error);
      nav("/");
    } finally {
      document.cookie.split(";").forEach(function (cookie) {
        let cookieName = cookie.split("=")[0].trim();
        document.cookie =
          cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      });
      setIsLoading(false);
      window.location.reload();
    }
  };

  const tryLogout = () => {
    console.log("Initiating logout...");
    handleLogout();
  };

  return [loading, result, tryLogout];
};

export default useLogout;
