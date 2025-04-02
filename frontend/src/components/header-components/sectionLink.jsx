import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionDropdown from "./sectionDropdown";
import { useNavigate } from "react-router-dom";

const SectionLink = ({ element, setShow, underlineBlack }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const nav = useNavigate();
  const timeoutId = useRef(null);
  const CLIENT_PATH = import.meta.env.VITE_CLIENT_PATH;

  return (
    <>
      <motion.div
        className="w-fit   lg:py-4"
        onHoverStart={() => {
          timeoutId.current = setTimeout(() => {
            if (window.innerWidth > 1024) setShowDropdown(true);
          }, 100);
        }}
        onHoverEnd={() => {
          if (window.innerWidth > 1024) setShowDropdown(false);
          clearTimeout(timeoutId.current);
        }}
        onClick={() => {
          if (window.innerWidth > 1024) setShow(false);
        }}
      >
        <div className="relative w-full p-2 lg:my-2 lg:p-0 lg:m-0 cursor-pointer  px-2 lg:px-4">
          {" "}
          <h2
            className="capitalize select-none list-none w-fit relative"
            onClick={() => {
              if (window.innerWidth > 1024)
                nav(`/${encodeURIComponent(element.slug)}`);
              else {
                setShowDropdown(true);
              }
            }}
          >
            {element.sectionTitle}{" "}
            <AnimatePresence>
              {showDropdown ? (
                <motion.div
                  className={`${
                    underlineBlack ? "bg-textDark" : "bg-textLight"
                  } h-[2px] absolute w-full origin-left`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 200,
                    mass: 0.15,
                  }}
                ></motion.div>
              ) : null}
            </AnimatePresence>
          </h2>{" "}
        </div>

        <SectionDropdown
          showDropdown={showDropdown}
          section={element}
          setShowDropdown={setShowDropdown}
        />
      </motion.div>{" "}
    </>
  );
};

export default SectionLink;
