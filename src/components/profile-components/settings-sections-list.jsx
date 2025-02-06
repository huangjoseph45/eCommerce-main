import { useContext, useEffect, useState } from "react";
import LogoutButton from "../logoutButton";
import debounce from "lodash.debounce";
import { ShowProfileContext } from "../utilities/ContextManager";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

const SettingsSectionsList = ({ sections, setSection }) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);

  useEffect(() => {
    const checkSize = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setShowProfileHeaders(true);
      }
    }, 100);

    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  });

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
            exit={{ opacity: 1, x: "-100%" }}
            transition={{
              duration: 0.3,
            }}
            className="flex flex-col w-full lg:w-1/4 p-4 fixed  items-center lg:items-start bg-white z-30 h-full lg:h-fit "
          >
            {accountSections}
            <LogoutButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsSectionsList;
