import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingSection from "../components/home-components/landingSection.jsx";
import FeaturedSection from "../components/home-components/featuredSection.jsx";

const minYOffsetHeader = 100;

const HomePage = () => {
  const timeoutId = useRef(null);
  const [showHeader, setShowHeader] = useState(false);

  console.log(window.innerWidth);

  const onScroll = useCallback(() => {
    setShowHeader((prev) => {
      return window.scrollY > minYOffsetHeader !== prev
        ? window.scrollY > minYOffsetHeader
        : prev;
    });
  }, [showHeader]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    setShowHeader(window.scrollY > minYOffsetHeader);

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
        <Footer></Footer>{" "}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (showHeader) {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }
          }}
          className={`fixed   p-[.8rem] left-1/2 -translate-x-1/2 bottom-4  rounded-full w-10 h-10 flex items-center justify-center ${
            showHeader ? "bg-bgBase2 rotate-180" : "bg-none"
          } transition-all duration-200`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.691"
            height="23.01"
            viewBox="0 0 14.691 23.01"
          >
            <g
              id="Component_22_9"
              data-name="Component 22 – 9"
              transform="translate(0.36)"
            >
              <g
                id="Group_26167"
                data-name="Group 26167"
                transform="translate(13.972) rotate(90)"
              >
                <line
                  id="Line_1234"
                  data-name="Line 1234"
                  x2="22.465"
                  transform="translate(0 6.986)"
                  fill="none"
                  stroke={`${showHeader ? "#000" : "#fff"}`}
                  strokeWidth="1"
                ></line>
                <g
                  id="Group_25960"
                  data-name="Group 25960"
                  transform="translate(15.421)"
                >
                  <line
                    id="Line_1235"
                    data-name="Line 1235"
                    x2="7.242"
                    y2="7.01"
                    fill="none"
                    stroke={`${showHeader ? "#000" : "#fff"}`}
                    strokeWidth="1"
                  ></line>
                  <line
                    id="Line_1236"
                    data-name="Line 1236"
                    y1="6.962"
                    x2="7.242"
                    transform="translate(0 7.01)"
                    fill="none"
                    stroke={`${showHeader ? "#000" : "#fff"}`}
                    strokeWidth="1"
                  ></line>
                </g>
              </g>
            </g>
          </svg>
        </motion.button>
      </div>
    </>
  );
};

export default HomePage;
