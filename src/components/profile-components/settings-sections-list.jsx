import { useContext, useEffect, useState } from "react";
import LogoutButton from "../logoutButton";
import debounce from "lodash.debounce";
import { ShowProfileContext } from "../utilities/ContextManager";
import { AnimatePresence } from "motion/react";
import { motion, delay, frame } from "motion/react";

const SettingsSectionsList = ({ sections, setSection }) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkSize = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setShowProfileHeaders(true);
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 320);

    return () => {
      clearTimeout(timer);
    };
  }, [showProfileHeaders]);

  const accountSections = sections.map((section, index) => {
    return (
      <li
        key={section}
        className="list-none cursor-pointer lg:hover:text-xl hover:text-[1.9srem] hover:font-semibold h-14 transition-all duration-100 flex items-center w-full justify-center lg:justify-start lg:text-lg text-2xl text-center hover:text-blue-950"
        onClick={() => {
          setSection(index);
          if (window.innerWidth < 1024) {
            setShowProfileHeaders(false);
          }
        }}
      >
        {section}
      </li>
    );
  });

  return (
    <>
      <AnimatePresence>
        {showProfileHeaders && (
          <motion.div
            initial={{ opacity: 0.5, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full lg:w-1/4 p-4 fixed items-center lg:items-start bg-bgBase z-30 h-full lg:h-fit"
          >
            {/* Inner AnimatePresence for motion.ul */}
            <AnimatePresence>
              {show && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {accountSections}
                </motion.ul>
              )}
            </AnimatePresence>

            <LogoutButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsSectionsList;
