import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingSection from "./home-components/landingSection";
import FeaturedSection from "./home-components/featuredSection";

const HomePage = () => {
  const timeoutId = useRef(null);
  const [showHeader, setShowHeader] = useState(false);

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
      <AnimatePresence>
        <motion.div
          className="fixed top-0 w-full p-0 items-center justify-center flex flex-col h-[5rem] z-10"
          initial={{ height: 0 }}
          animate={{ height: "fit-content", overflow: "hidden" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Header showBackground={showHeader} />
        </motion.div>
      </AnimatePresence>
      <LandingSection />
      <div className="h-screen"></div>
    </>
  );
};

export default HomePage;
