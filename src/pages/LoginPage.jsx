import { useContext, useEffect, useState } from "react";
import validateEmail from "../components/utilities/validateEmail";
import validatePassword from "../components/utilities/validatePassword";
import { AnimatePresence, motion } from "motion/react";
import ErrorMessage from "../components/login-components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ProductContext } from "../components/utilities/ProductContext";
import getDataFromServer from "../components/utilities/getDataFromServer";
import { useNavigate } from "react-router-dom";
import handleLogout from "../components/utilities/handleLogout";

const LoginPage = () => {
  const nav = useNavigate();

  const [isModeSignIn, setModeSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorState, setErrorState] = useState({
    isEmailInvalid: false,
    isPasswordInvalid: false,
    isError: false,
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const { userInfo, setUserInfo } = useContext(ProductContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data["cart"] = userInfo;

    try {
      handleLogout();

      const validatedEmail = validateEmail(data.email);
      const validatedPassword = validatePassword(data.password);

      setErrorState({
        isEmailInvalid: !validatedEmail,
        isPasswordInvalid: !validatedPassword,
        isError: false,
      });

      if (!validatedEmail || !validatedPassword) return;

      const endpoint = isModeSignIn
        ? "http://localhost:2000/api/users/signin"
        : "http://localhost:2000/api/users/createuser";

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

        console.log("Error from server:", errorBody);
        setErrorState((prev) => ({
          ...prev,
          isError: true,
        }));
        return;
      }

      getDataFromServer({ setUserInfo });

      const result = await response.text();
      console.log(result);
      nav("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderErrorMessage = (condition, message, resetStateKey) =>
    condition && (
      <ErrorMessage
        message={message}
        setState={(val) =>
          setErrorState((prev) => ({ ...prev, [resetStateKey]: val }))
        }
      />
    );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col m-auto w-[25rem] gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%]"
      >
        <div className="flex flex-1">
          <p
            onClick={() => setModeSignIn(true)}
            className={`cursor-pointer w-1/2 m-auto text-left text-2xl ${
              isModeSignIn ? "text-slate-900" : "text-gray-400"
            }`}
          >
            Sign In
          </p>
          <p
            onClick={() => setModeSignIn(false)}
            className={`cursor-pointer w-1/2 m-auto text-right text-2xl ${
              !isModeSignIn ? "text-slate-900" : "text-gray-400"
            }`}
          >
            Create Account
          </p>
        </div>
        <hr className="w-full border-t border-slate-900 mb-4" />
        <input
          type="text"
          name="email"
          autoComplete="account-email"
          className={`w-full border p-2 ${
            errorState.isEmailInvalid ? "border-red-500" : "border-gray-400"
          }`}
          placeholder="Email"
        />
        {renderErrorMessage(
          errorState.isEmailInvalid,
          "Invalid Email",
          "isEmailInvalid"
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="account-password"
            className={`w-full border p-2 ${
              errorState.isPasswordInvalid
                ? "border-red-500"
                : "border-gray-400"
            }`}
            placeholder="Password"
          />
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-[2rem] cursor-pointer text-xl  ${
              !showPassword && "opacity-35 text-black"
            }`}
          />
          <div
            className="h-6 w-6 absolute top-1/2 left-full -translate-y-1/2 translate-x-1/3 flex justify-center items-center rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-all duration-200"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ?
          </div>
          <AnimatePresence>
            {showTooltip && (
              <motion.p
                className="absolute w-full border bg-gray-300 p-2 left-full translate-x-[1rem] flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                Password must be at least 8 characters and contain a number
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {renderErrorMessage(
          errorState.isPasswordInvalid,
          "Invalid Password",
          "isPasswordInvalid"
        )}
        <button
          type="submit"
          className="bg-slate-900 text-white w-full p-3 text-sm hover:bg-slate-800 hover:scale-[102.5%] transition-all duration-300"
        >
          {isModeSignIn ? "Sign In" : "Create Account"}
        </button>
        {renderErrorMessage(
          errorState.isError,
          "Invalid Email/Password",
          "isError"
        )}
      </form>
    </>
  );
};

export default LoginPage;
