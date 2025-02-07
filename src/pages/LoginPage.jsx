import { useContext, useEffect, useState } from "react";
import validateEmail from "../components/utilities/validateEmail";
import validatePassword from "../components/utilities/validatePassword";
import { AnimatePresence, motion } from "motion/react";
import ErrorMessage from "../components/login-components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ProductContext } from "../components/utilities/ContextManager";
import getDataFromServer from "../components/utilities/getDataFromServer";
import { useNavigate } from "react-router-dom";
import handleLogout from "../components/utilities/handleLogout";
import Logo from "../components/header-components/logo";
import Header from "../components/header";

const LoginPage = () => {
  const nav = useNavigate();

  const [isModeSignIn, setModeSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errorState, setErrorState] = useState({
    isEmailInvalid: false,
    isPasswordInvalid: false,
    isError: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const { userInfo } = useContext(ProductContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    data["cart"] = userInfo;
    data["remember"] = checked;

    console.log(data);

    try {
      await handleLogout();
      if (!isModeSignIn && data.password !== data.password2) {
        console.log(data.password !== data.password2);
        setErrorMessage("Passwords do not match");
        setErrorState((prev) => ({
          ...prev,
          isError: true,
        }));
        return;
      }

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

        console.error("Error from server:", errorBody);
        setErrorState((prev) => ({
          ...prev,
          isError: true,
          errorMessage: "Invalid Email or Password",
        }));
        setErrorMessage("Invalid Email or Password");

        return;
      }

      const result = await response.text();
      nav("/");
    } catch (error) {
      setErrorState((prev) => ({
        ...prev,
        isError: true,
      }));
      setErrorMessage("Internal Server Error");
    }
  };

  const renderErrorMessage = (condition, message, resetStateKey) => {
    return (
      condition && (
        <ErrorMessage
          message={message}
          setState={(val) =>
            setErrorState((prev) => ({ ...prev, [resetStateKey]: val }))
          }
        />
      )
    );
  };

  return (
    <>
      <Header />
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col m-auto w-[25rem] gap-1 absolute ${
          isModeSignIn ? "top-1/2" : "top-[57.5%]"
        } left-1/2 -translate-x-1/2 -translate-y-[100%]`}
      >
        <SelectSignIn
          setModeSignIn={setModeSignIn}
          isModeSignIn={isModeSignIn}
        />
        <hr className="w-full border-t border-slate-900 mb-4" />
        <input
          type="text"
          name="email"
          autoComplete="account-email"
          className={`w-full border p-3 mb-4 ${
            errorState.isEmailInvalid ? "border-red-500" : "border-gray-400"
          }`}
          placeholder="Email"
        />
        {renderErrorMessage(
          errorState.isEmailInvalid,
          "Invalid Email",
          "isEmailInvalid"
        )}
        <div className="relative border mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="account-password"
            className={`w-full border p-3  ${
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
                className="absolute w-full border bg-gray-300 p-2 left-1/2 -translate-x-1/2 top-[12 rem] lg:left-full lg:translate-x-[1rem] flex justify-center items-center"
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
        {!isModeSignIn && (
          <div className="relative border mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password2"
              autoComplete="account-password"
              className={`w-full border p-3  ${
                errorState.isPasswordInvalid
                  ? "border-red-500"
                  : "border-gray-400"
              }`}
              placeholder="Password"
            />
          </div>
        )}

        {renderErrorMessage(
          errorState.isPasswordInvalid,
          "Invalid Password",
          "isPasswordInvalid"
        )}
        <div
          className="flex w-fit p-1 justify-center items-center gap-2 mb-4 "
          onClick={() => {
            console.log("clicked");
            setChecked(!checked);
          }}
        >
          <div className="inline-flex items-center justify-center">
            <label className="flex items-center cursor-pointer relative">
              <input
                defaultChecked={false}
                type="checkbox"
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded-sm shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                id="check"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
          <label
            htmlFor="remember"
            className="cursor-pointer high select-none text-gray-700"
          >
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="bg-slate-900 text-white w-full p-4 text-sm hover:bg-slate-800 hover:scale-[102.5%] transition-all duration-300"
        >
          {isModeSignIn ? "Sign In" : "Create Account"}
        </button>
        {renderErrorMessage(errorState.isError, errorMessage, "isError")}
      </form>
    </>
  );
};

export default LoginPage;

function SelectSignIn({ setModeSignIn, isModeSignIn }) {
  return (
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
  );
}
