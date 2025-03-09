import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingSection from "../components/home-components/landingSection.jsx";
import FeaturedSection from "../components/home-components/featuredSection";

const HomePage = () => {
  const timeoutId = useRef(null);
  const [showHeader, setShowHeader] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const onScroll = useCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      if (window.scrollY > 50) setShowHeader(true);
      else {
        setShowHeader(false);
      }
    }, 0); // Adjust debounce delay as needed
  }, []);

  console.log(window.innerWidth);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId.current);
    };
  }, [onScroll]);

  return (
    <>
      <div className="relative">
        <AnimatePresence>
          <motion.div
            className="fixed top-0 w-full p-0  flex flex-col z-10"
            initial={{ height: 0 }}
            animate={{ height: "fit-content", overflow: "hidden" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Header
              showBackground={showHeader}
              showLoginModal={showLoginModal}
              setShowLoginModal={setShowLoginModal}
            />
          </motion.div>
        </AnimatePresence>
        <LandingSection
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
        />
        <FeaturedSection />
        <div className="h-screen"></div>
      </div>
    </>
  );
};

export default HomePage;
