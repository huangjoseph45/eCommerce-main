import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAuthenticate from "../components/utilities/useAuthenticate";
import { AnimatePresence, motion } from "motion/react";
import ErrorMessage from "../components/login-components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ProductContext } from "../components/utilities/ContextManager";
import useSideBarToggle from "./utilities/sideBarToggles";

// FIND SOME WAY TO USE PORTALS???

const formVariants = {
  first: {
    x: "-50%",
    scale: 0,
    y: "-100%",
    opacity: 0,
  },
  show: {
    x: "-50%",
    scale: 1,
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.75,
    },
  },
  leave: {
    scale: 0,
    y: "100%",
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.15,
    },
  },
};

const LoginModal = ({ showLogin, setShowLogin }) => {
  const [isModeSignIn, setModeSignIn] = useState();
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
  useSideBarToggle({ setShowSidebar: setShowLogin, showSidebar: showLogin });

  //   const [searchParams] = useSearchParams();

  //   useEffect(() => {
  //     if (searchParams.get("q") === "sign-up") setModeSignIn(false);
  //   }, [searchParams]);

  const handleSubmit = async (event) => {
    onAuthenticate(event);
  };
  useEffect(() => {
    setModeSignIn(showLogin !== "create");
    if (showLogin) {
      document.body.style.overflow = "hidden";
    }
  }, [showLogin]);

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

  return createPortal(
    <AnimatePresence>
      {showLogin !== false && (
        <div className={`text-sm select-none`}>
          <motion.div
            onClick={() => setShowLogin(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.15 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-screen h-screen bg-bgBase/15 backdrop-blur-sm fixed top-0 z-30"
          ></motion.div>

          <motion.form
            variants={formVariants}
            initial="first"
            animate={"show"}
            exit={"leave"}
            onSubmit={handleSubmit}
            className={`flex flex-col h-fit m-auto w-[100vw] max-w-[30rem]  gap-1  shadow-md p-16 rounded-lg top-[20%] z-40
       bg-bgBase left-1/2 -translate-x-1/2 fixed`}
          >
            <div
              className={`cursor-pointer absolute top-0 right-0 p-2 rounded-full m-2 hover:bg-bgBlack/15 transition-all duration-150`}
              title={"Close"}
              onClick={() => setShowLogin(false)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                role="img"
                width="32px"
                height="32px"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
                ></path>
              </svg>
            </div>

            <SelectSignIn
              setModeSignIn={setModeSignIn}
              isModeSignIn={isModeSignIn}
            />
            <hr className="w-full border-t border-bgSecondary mb-4" />
            <input
              type="text"
              name="email"
              autoComplete="account-email"
              className={`w-full bg-bgBase border p-3 mb-4 ${
                errorState.isEmailInvalid
                  ? "border-errorTrue"
                  : "border-gray-400"
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
                className={`w-full border bg-bgBase p-3  ${
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
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
                  className={`w-full border p-3 bg-bgBase  ${
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
          </motion.form>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LoginModal;

function SelectSignIn({ setModeSignIn, isModeSignIn }) {
  return (
    <div className="flex flex-1 whitespace-normal w-[full]">
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
        className={`w-fit whitespace-normal  cursor-pointer m-auto text-right text-2xl ${
          !isModeSignIn ? "text-bgSecondary" : "text-gray-400"
        }`}
      >
        New Account
      </p>
    </div>
  );
}
