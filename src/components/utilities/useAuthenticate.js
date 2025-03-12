import { useEffect, useState } from "react";
import useLogout from "./useLogout";
import validateEmail from "./validateEmail";
import validatePassword from "./validatePassword";
import { useNavigate } from "react-router-dom";
import isLoggedIn from "./isLoggedIn";

const useAuthenticate = ({
  setErrorState,
  checked,
  userInfo,
  isModeSignIn = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, result, tryLogout] = useLogout();
  const [errorMessage, setErrorMessage] = useState("");
  const url = `${import.meta.env.VITE_PATH}/users`;

  const handleAuthenticate = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    data["cart"] = userInfo;
    data["remember"] = checked;
    // tryLogout();

    try {
      console.log("hi");
      const validatedEmail = validateEmail(data.email);
      const validatedPassword = validatePassword(data.password);

      setErrorState({
        isEmailInvalid: !validatedEmail,
        isPasswordInvalid: !validatedPassword,
        isError: false,
      });

      if (!validatedEmail || !validatedPassword) return;

      const endpoint = isModeSignIn ? `${url}/signin` : `${url}/createuser`;

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (jsonErr) {
          errorBody = { error: response };
        }

        console.error("Error from server:", errorBody);
        setErrorState((prev) => ({
          ...prev,
          isError: true,
          errorMessage: "Invalid Email or Password",
        }));
        setErrorMessage("Invalid Email or Password");
        setIsLoading(false);

        return;
      }

      setIsLoading(false);
      // window.location.reload();
    } catch (error) {
      setIsLoading(false);
      setErrorState((prev) => ({
        ...prev,
        isError: true,
      }));
      setErrorMessage("Internal Server Error");
    }
  };

  const onAuthenticate = (event) => {
    handleAuthenticate(event);
  };

  return [isLoading, errorMessage, onAuthenticate];
};
export default useAuthenticate;
