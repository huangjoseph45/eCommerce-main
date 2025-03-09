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
      setUserInfo({}); // Clear user info in context
      nav("/"); // Redirect to login page
    } catch (error) {
      setResult(false);
      console.error("Logout Error: ", error);
      // Optionally, show a user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  const tryLogout = () => {
    console.log("Initiating logout...");
    handleLogout();
  };

  return [loading, result, tryLogout];
};

export default useLogout;
