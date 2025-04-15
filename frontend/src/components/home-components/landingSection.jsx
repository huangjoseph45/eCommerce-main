import useAuth from "../utilities/useAuth";
import FancyText from "./fancyText";
import { useEffect, useState } from "react";
import LoginModal from "../loginModal";
import { motion, AnimatePresence } from "motion/react";
import { easeInOut, spring } from "motion";

const LandingSection = ({ featuredSectionRef }) => {
  const { loggedIn } = useAuth();
  const [hoverState, setHoverState] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const resizeFunc = () => {
      if (window.innerWidth < 1024) {
        setHoverState(true);
      }
    };
    window.addEventListener("resize", resizeFunc);
    resizeFunc();

    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  }, []);

  return (
    <motion.div
      className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl items-center min-h-[40rem] h-[70vh] justify-center flex  border relative before:content-[''] before:h-full before:w-full before:bg-bgBlack/15 border-none text-bgBase2 overflow-hidden  before:absolute before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 
`}
      onHoverStart={() => {
        if (window.innerWidth > 1024) setHoverState(true);
      }}
      onHoverEnd={() => {
        if (window.innerWidth > 1024) setHoverState(false);
      }}
    >
      <LoginModal showLogin={showLoginModal} setShowLogin={setShowLoginModal} />
      <img
        src="https://www.ralphlauren.com/on/demandware.static/-/Library-Sites-RalphLauren_NA_Library/default/dwb54d4127/img/202501/20250123-men-polo-active-club-plp/0123_m_polo_active_club_plp_c01_img.jpg"
        alt=""
        className={`absolute object-cover w-full h-full select-none -z-10 transition-all duration-30 `}
      />
      <div className="absolute top-[38%] flex flex-col items-center justify-center gap-4">
        <motion.a
          initial={{ translateY: "0", scale: 1, opacity: 0 }}
          animate={
            hoverState
              ? { translateY: "-25px", scale: 1.1, opacity: 1 }
              : { translateY: "0", scale: 1, opacity: 1 }
          }
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
          className="text-5xl mb-6 white flex flex-row  text-center font-extralight hover:text-bgTertiary transition-colors duration-150"
          href="/new"
        >
          Shop Our Latest{" "}
        </motion.a>
        <AnimatePresence>
          {hoverState && (
            <motion.div
              className="text-xl font-extralight flex items-center justify-center flex-col hover:text-bgTertiary transition-colors duration-200"
              initial={{ translateY: "0", scale: 1, opacity: 0 }}
              animate={
                hoverState
                  ? { translateY: "-35px", scale: 1.01, opacity: 1 }
                  : { translateY: "0", scale: 1, opacity: 0 }
              }
              exit={{ translateY: "0", scale: 1, opacity: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.5,
              }}
              onClick={() =>
                featuredSectionRef?.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <p>Explore new styles</p>
              <button className="-rotate-90 cursor-pointer">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  role="img"
                  width="48px"
                  height="48px"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1"
                    d="M15.525 18.966L8.558 12l6.967-6.967"
                  ></path>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* {!loggedIn && (
          <div className="flex flex-row gap-6">
            <button
              onClick={() => {
                setShowLoginModal("login");
              }}
              className="text-xl bg-bgSecondary text-bgBase3 px-4 py-2 rounded-full hover:outline hover:outline-2 outline-bgTertiary"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowLoginModal("create")}
              className="text-xl bg-bgTertiary text-bgBase3 px-4 py-2 rounded-full hover:outline hover:outline-2 outline-bgBase"
            >
              Join Us
            </button>
          </div>
        )} */}
        {/* <div className="text-sm lg:text-base max-w-[30rem] text-center w-full px-4">
          Discover the latest trends and fresh arrivals, crafted with premium
          quality and attention to detail. Elevate your style with the finest
          new pieces, designed for comfort, durability, and timeless appeal.
        </div> */}
      </div>
    </motion.div>
  );
};

export default LandingSection;
