import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CLIENT_PATH = import.meta.env.VITE_CLIENT_PATH;

const SectionDropdown = ({ showDropdown, section, setShowDropdown }) => {
  return (
    <AnimatePresence>
      {showDropdown && window.innerWidth > 1024 ? (
        <>
          {/* {createPortal(
            <motion.div
              className="fixed w-screen h-screen bg-bgBlack/5 backdrop-blur-sm left-0 top-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>,
            document.body
          )} */}
          <motion.div
            className="absolute lg:pt-[.875rem] bg-bgBase2 px-4 origin-top  top-[105%] min-w-[32rem] flex flex-col pb-6 rounded-lg"
            initial={{ top: "80%", opacity: 0, scale: 0.85 }}
            animate={{ top: "105%", opacity: 1, scale: 1 }}
            exit={{ top: "80%", opacity: 0, scale: 0.85 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 200,
              mass: 0.2,
            }}
          >
            {section &&
              section.subsections.map((subsection) => {
                return (
                  <a
                    href={`${CLIENT_PATH}/${encodeURIComponent(
                      section.slug
                    )}/${encodeURIComponent(subsection.slug)}`}
                    key={section._id + subsection.slug + subsection.name}
                    className="text-textHollow hover:text-textDark w-fit capitalize"
                  >
                    {subsection.name}
                  </a>
                );
              })}
          </motion.div>
        </>
      ) : showDropdown ? (
        <motion.div
          className="absolute w-full h-screen top-0 bg-bgBase z-20"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ ease: "easeInOut" }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="p-2 w-6 h-6 rounded-full hover:bg-bgBlack/10 "
            onClick={() => setShowDropdown(false)}
          />
          <ul className="flex flex-col px-2 mt-4">
            {section &&
              section.subsections.map((subsection) => {
                return (
                  <a
                    href={`${CLIENT_PATH}/${encodeURIComponent(
                      section.slug
                    )}/${encodeURIComponent(subsection.slug)}`}
                    key={section._id + subsection.slug}
                    className="text-textHollow hover:text-textDark w-fit capitalize"
                  >
                    {subsection.name}
                  </a>
                );
              })}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SectionDropdown;
