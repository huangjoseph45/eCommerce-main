import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingSection from "../components/home-components/landingSection.jsx";
import FeaturedSection from "../components/home-components/featuredSection.jsx";

const HomePage = () => {
  const timeoutId = useRef(null);
  const [showHeader, setShowHeader] = useState(false);

  console.log(window.innerWidth);

  const onScroll = useCallback(() => {
    setShowHeader((prev) => {
      return window.scrollY > 50 !== prev ? window.scrollY > 50 : prev;
    });
  }, [showHeader]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    setShowHeader(window.scrollY > 50);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    console.log(showHeader);
  }, [showHeader]);

  return (
    <>
      <div className="relative">
        <AnimatePresence>
          <motion.div className="fixed top-0 w-full p-0  flex flex-col z-10">
            <Header showBackground={showHeader} />
          </motion.div>
        </AnimatePresence>
        <LandingSection />
        <FeaturedSection />
        <div className="h-screen"></div>
      </div>
    </>
  );
};

export default HomePage;
