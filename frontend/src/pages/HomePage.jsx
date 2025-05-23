import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { AnimatePresence, motion } from "motion/react";
import LandingSection from "../components/home-components/landingSection.jsx";
import FeaturedSection from "../components/home-components/featuredSection.jsx";
import { useRef } from "react";

const HomePage = () => {
  const featuredSectionRef = useRef();
  return (
    <>
      <div className="relative">
        <AnimatePresence>
          <motion.div className="fixed top-0 w-full p-0  flex flex-col z-10">
            <Header alternateTransparent={true} />
          </motion.div>
        </AnimatePresence>
        <LandingSection featuredSectionRef={featuredSectionRef} />
        <FeaturedSection elRef={featuredSectionRef} />
        <Footer></Footer>{" "}
      </div>
    </>
  );
};

export default HomePage;
