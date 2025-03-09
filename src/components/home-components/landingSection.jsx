import { useNavigate } from "react-router-dom";
import isLoggedIn from "../../components/utilities/isLoggedIn";
import FancyText from "./fancyText";
import { useEffect } from "react";

const LandingSection = ({ setShowLoginModal, showLoginModal }) => {
  const loggedIn = isLoggedIn();
  const nav = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl items-center h-screen justify-center flex  border relative before:content-[''] before:h-full before:w-full before:bg-bgBlack/5 border-none text-bgBase2 overflow-hidden">
      <img
        src="https://www.ralphlauren.com/on/demandware.static/-/Library-Sites-RalphLauren_NA_Library/default/dwb54d4127/img/202501/20250123-men-polo-active-club-plp/0123_m_polo_active_club_plp_c01_img.jpg"
        alt=""
        className="absolute object-cover w-full h-full select-none"
      />
      <div className="absolute top-1/3 flex flex-col items-center justify-center gap-4">
        <FancyText text={"Imagine Collective"} />
        <a className="text-2xl mb-6" href="/s">
          <FancyText text={"Explore New Arrivals"} size="2xl" />
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
