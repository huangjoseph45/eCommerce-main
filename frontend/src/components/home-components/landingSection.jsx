import useAuth from "../utilities/useAuth";
import FancyText from "./fancyText";
import { useEffect, useState } from "react";
import LoginModal from "../loginModal";

const LandingSection = () => {
  const { loggedIn } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl items-center min-h-[40rem] h-screen justify-center flex  border relative before:content-[''] before:h-full before:w-full before:bg-bgBlack/5 border-none text-bgBase2 overflow-hidden">
      <LoginModal showLogin={showLoginModal} setShowLogin={setShowLoginModal} />
      <img
        src="https://www.ralphlauren.com/on/demandware.static/-/Library-Sites-RalphLauren_NA_Library/default/dwb54d4127/img/202501/20250123-men-polo-active-club-plp/0123_m_polo_active_club_plp_c01_img.jpg"
        alt=""
        className="absolute object-cover w-full h-full select-none -z-10"
      />
      <div className="absolute top-[38%] flex flex-col items-center justify-center gap-4">
        <a className="text-4xl mb-6 white flex flex-row  text-center" href="/s">
          EXPLORE NEW ARRIVALS{" "}
        </a>

        {!loggedIn && (
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
        )}
        <div className="text-sm lg:text-base max-w-[30rem] text-center w-full px-4">
          Discover the latest trends and fresh arrivals, crafted with premium
          quality and attention to detail. Elevate your style with the finest
          new pieces, designed for comfort, durability, and timeless appeal.
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
