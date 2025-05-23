import useAuth from "../utilities/useAuth";
import { motion } from "motion/react";

const ProfileButton = ({ showLogin, setShowLogin, setShowSidebar }) => {
  const { loggedIn } = useAuth();

  const clickedFunc = () => {
    if (!loggedIn) {
      setShowLogin(!showLogin);
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
        className="relative aspect-square rounded-full cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2 hover:text-bgTertiary size-12 2xl:size-[4.5rem]"
        href={loggedIn ? "/profile" : undefined} // Properly conditionally set href
        onClick={clickedFunc}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          fill="none"
          title="Profile"
          className="w-full h-full"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M7.5 42v-6a7.5 7.5 0 017.5-7.5h18a7.5 7.5 0 017.5 7.5v6m-9-27a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </motion.a>
    </>
  );
};

export default ProfileButton;
