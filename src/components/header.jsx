import Logo from "./header-components/logo";
import HeaderTabs from "./header-components/headertabs";
import SearchBar from "./header-components/searchbar";
import Cart from "./header-components/cart";
import ProfileButton from "./header-components/profile-button";
import Sidebar from "./header-components/sidebar";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const opacityVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const Header = () => {
  const [isVisible, setVisible] = useState(true);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const resizeEvent = () => {
      if (window.innerWidth < 1024) {
        mouseEnter();
      } else {
        mouseLeave();
      }
    };

    resizeEvent();

    window.addEventListener("resize", resizeEvent);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("resize", resizeEvent);
    };
  }, [location.pathname]);

  const mouseEnter = () => {
    if (!isVisible) {
      setVisible(true);
    }
    clearTimeout(timeoutRef.current);
  };

  const mouseLeave = () => {
    if (location.pathname !== "/" && window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        // setVisible(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      className={`sticky top-0 bg-white h-[10vh] flex px-4 py-2 flex-row justify-between max-h-24 z-40 ${
        isVisible ? "opacity-1" : "opacity-0"
      }`}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      variants={opacityVariants}
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration: 0.15 }}
    >
      <div className="flex flex-row items-end h-fit my-auto gap-12">
        <Logo />
        <HeaderTabs />
      </div>

      {/* Utility Items for PC/Large Screens */}
      <div className="gap-3 sm:gap-4 w-fit justify-center items-center flex">
        <SearchBar />
        <Cart />
        <ProfileButton />
        <Sidebar />
      </div>
    </motion.div>
  );
};

export default Header;
