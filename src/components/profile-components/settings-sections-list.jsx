import { useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { ShowProfileContext } from "../utilities/ContextManager";
import { AnimatePresence } from "motion/react";
import { motion, delay, frame } from "motion/react";
import Button from "../button";
import useLogout from "../utilities/useLogout";

const settingHeader = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.5,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0,
      delayChildren: 0.1,
      staggerChildren: 0.03,
    },
  },
  slide: {
    scale: 1,
    x: "-100%",
    transition: {
      duration: 0.15,
    },
  },
};

const sectionItem = {
  variants: {
    closed: { opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { duration: 0.2 },
};

const SettingsSectionsList = ({ sections, setSection }) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);
  const [show, setShow] = useState(false);
  const [loading, result, tryLogout] = useLogout();

  useEffect(() => {
    const checkSize = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        document.body.style.overflow = "scroll";
        setShowProfileHeaders(true);
      }
    }, 100);

    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showProfileHeaders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 10);

    document.body.style.overflow =
      window.innerWidth < 1024 && showProfileHeaders ? "hidden" : "scroll";

    return () => {
      clearTimeout(timer);
    };
  }, [showProfileHeaders]);

  const accountSections = sections.map((section, index) => {
    return (
      <motion.li
        key={section}
        {...sectionItem}
        className="list-none cursor-pointer lg:hover:text-xl hover:text-[1.9srem] hover:font-medium h-14 transition-all duration-100 flex items-center w-full justify-center lg:justify-start lg:text-lg text-2xl text-center hover:text-bgTertiary"
        onClick={() => {
          setSection(index);
          if (window.innerWidth < 1024) {
            setShowProfileHeaders(false);
          }
        }}
      >
        {section}{" "}
      </motion.li>
    );
  });

  return (
    <>
      <AnimatePresence>
        {showProfileHeaders && (
          <motion.div
            initial="closed"
            variants={settingHeader}
            animate={show ? "open" : "closed"}
            exit={!showProfileHeaders ? "closed" : "slide"}
            className="flex flex-col w-full lg:w-1/4 p-4 pt-32 lg:pt-[4rem] absolute bg-bgBase lg:bg-none lg:static top-[0rem] overscroll-contain items-center lg:items-start z-30 h-full lg:h-fit lg:ml-6"
          >
            {show && accountSections}
            <span className="m-2"></span>
            <motion.div className="w-fit min-w-20" {...sectionItem}>
              <Button
                buttonFunc={tryLogout}
                buttonText={"Log Out"}
                invert={false}
                loading={loading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsSectionsList;
