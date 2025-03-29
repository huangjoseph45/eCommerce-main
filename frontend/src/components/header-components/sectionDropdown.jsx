import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const subSections = [
  { id: 1, name: "Explore All", tagName: "" },
  { id: 1, name: "New Arrivals", tagName: "new" },
  { id: 2, name: "Shirts", tagName: "shirt" },
  { id: 3, name: "Hoodies", tagName: "hoodie" },
  { id: 4, name: "Pants", tagName: "pants" },
];

const CLIENT_PATH = import.meta.env.VITE_CLIENT_PATH;

const SectionDropdown = ({ showDropdown, section, setShowDropdown }) => {
  return (
    <AnimatePresence>
      {showDropdown && window.innerWidth > 1024 ? (
        <>
          {createPortal(
            <motion.div
              className="fixed w-screen h-screen bg-bgBlack/5 backdrop-blur-sm left-0 top-0 -z-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>,
            document.body
          )}
          <motion.div
            className="absolute lg:py-[.875rem] bg-bgBase2 px-2 origin-top w-screen top-full   left-0 flex flex-col"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 200,
              mass: 0.2,
            }}
          >
            {subSections.map((subsection) => {
              return (
                <a
                  href={`${CLIENT_PATH}/${encodeURIComponent(
                    section.slug
                  )}/${encodeURIComponent(subsection.tagName)}`}
                  key={subsection.id}
                  className="text-textHollow hover:text-textDark w-fit"
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
            {subSections.map((subsection) => {
              return (
                <a
                  href={`${CLIENT_PATH}/${encodeURIComponent(
                    section.slug
                  )}/${encodeURIComponent(subsection.tagName)}`}
                  key={subsection.id}
                  className="text-textHollow hover:text-textDark w-fit"
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
