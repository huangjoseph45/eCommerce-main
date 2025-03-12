import { useNavigate } from "react-router-dom";
import isLoggedIn from "../utilities/isLoggedIn";
import { motion } from "motion/react";

const ProfileButton = ({ showLogin, setShowLogin, setShowSidebar }) => {
  const loggedIn = isLoggedIn();

  const clickedFunc = () => {
    if (!loggedIn) {
      console.log(setShowLogin);
      setShowLogin(!showLogin);
      console.log(setShowSidebar);
      if (setShowSidebar) {
        setShowSidebar(false);
      }
    }
  };

  return (
    <>
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.5 }}
        className="relative aspect-square rounded-full cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2 hover:text-bgTertiary"
        href={loggedIn ? "/profile" : undefined} // Properly conditionally set href
        onClick={clickedFunc}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="40px"
          height="40px"
          fill="none"
          title="Profile"
          onClick={clickedFunc}
          className=""
        >
          <path
            stroke="currentColor"
            strokeWidth="3"
            d="M7.5 42v-6a7.5 7.5 0 017.5-7.5h18a7.5 7.5 0 017.5 7.5v6m-9-27a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </motion.a>
    </>
  );
};

export default ProfileButton;
