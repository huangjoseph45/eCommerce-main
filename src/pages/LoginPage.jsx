import { useContext, useEffect, useState } from "react";
import useAuthenticate from "../components/utilities/useAuthenticate";
import { AnimatePresence, motion } from "motion/react";
import ErrorMessage from "../components/login-components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ProductContext } from "../components/utilities/ContextManager";
import Header from "../components/header";

const LoginPage = () => {
  const [isModeSignIn, setModeSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errorState, setErrorState] = useState({
    isEmailInvalid: false,
    isPasswordInvalid: false,
    isError: false,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const { userInfo } = useContext(ProductContext);
  const [isLoading, errorMessage, onAuthenticate] = useAuthenticate({
    setErrorState,
    checked,
    userInfo,
    isModeSignIn,
  });

  const handleSubmit = async (event) => {
    onAuthenticate(event);
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
        className={`flex flex-col h-fit m-auto min-w-[17rem] w-[50vw] max-w-[25rem] gap-1 absolute  ${
          isModeSignIn ? "top-[30rem]" : "top-[34rem]"
        } left-1/2 -translate-x-1/2 -translate-y-[100%]`}
      >
        <SelectSignIn
          setModeSignIn={setModeSignIn}
          isModeSignIn={isModeSignIn}
        />
        <hr className="w-full border-t border-bgSecondary mb-4" />
        <input
          type="text"
          name="email"
          autoComplete="account-email"
          className={`w-full border p-3 mb-4 ${
            errorState.isEmailInvalid ? "border-errorTrue" : "border-gray-400"
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
                ? "border-errorTrue"
                : "border-gray-400"
            }`}
            placeholder="Password"
          />
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-[2rem] cursor-pointer text-xl  ${
              !showPassword && "opacity-35 text-textDark"
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
                className={`absolute w-full border bg-gray-300 p-2 left-0 -translate-x-1/2 ${
                  isModeSignIn ? "top-[12rem]" : "top-[16rem]"
                } lg:left-[105%] lg:top-[3rem] lg:translate-x-[1rem] flex justify-center items-center`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
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
                  ? "border-errorTrue"
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
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded-sm shadow hover:shadow-md border border-slate-300 checked:bg-bgSecondaryLight checked:border-bgSecondaryLight"
                id="check"
              />
              <span className="absolute text-textLight opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
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
          className="bg-bgSecondary text-textLight w-full p-4 text-sm hover:bg-bgSecondaryLight hover:scale-[102.5%] transition-all duration-300"
        >
          {isModeSignIn
            ? isLoading
              ? "Signing In..."
              : "Sign In"
            : isLoading
            ? "Creating Account..."
            : "Create Account"}
        </button>
        {renderErrorMessage(errorState.isError, errorMessage, "isError")}
      </form>
    </>
  );
};

export default LoginPage;

function SelectSignIn({ setModeSignIn, isModeSignIn }) {
  return (
    <div className="flex flex-1 whitespace-nowrap">
      <p
        onClick={() => setModeSignIn(true)}
        className={`cursor-pointer w-1/2 m-auto text-left text-2xl ${
          isModeSignIn ? "text-bgSecondary" : "text-gray-400"
        }`}
      >
        Sign In
      </p>
      <p
        onClick={() => setModeSignIn(false)}
        className={`cursor-pointer w-1/2 m-auto text-right text-2xl ${
          !isModeSignIn ? "text-bgSecondary" : "text-gray-400"
        }`}
      >
        New Account
      </p>
    </div>
  );
}
