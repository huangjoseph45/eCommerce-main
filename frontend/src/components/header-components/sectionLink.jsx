import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionDropdown from "./sectionDropdown";
import { useNavigate } from "react-router-dom";

const SectionLink = ({ element, setShow, underlineBlack }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const nav = useNavigate();
  const timeoutId = useRef(null);
  const CLIENT_PATH = import.meta.env.VITE_CLIENT_PATH;
  return (
    <>
      <motion.div
        className="w-fit "
        onHoverStart={() => {
          setShowHighlight(true);
          timeoutId.current = setTimeout(() => {
            if (window.innerWidth > 1024) setShowDropdown(true);
          }, 250);
        }}
        onHoverEnd={() => {
          if (window.innerWidth > 1024) setShowDropdown(false);
          clearTimeout(timeoutId.current);
          setShowHighlight(false);
        }}
        onClick={() => {
          if (window.innerWidth > 1024) setShow(false);
        }}
      >
        <div className="text-base 2xl:text-2xl relative w-full p-2 lg:my-4 lg:p-0 lg:m-0 cursor-pointer  px-2 lg:px-4 h-full">
          {" "}
          <h2
            className="capitalize select-none list-none w-fit relative"
            onClick={() => {
              if (window.innerWidth > 1024)
                nav(`/${encodeURIComponent(element.slug)}`);
              else {
                setShowDropdown(true);
                setShowHighlight(false);
              }
            }}
          >
            {element.sectionTitle}{" "}
            <AnimatePresence>
              {showHighlight ? (
                <motion.div
                  className={`${
                    underlineBlack ? "bg-textDark" : "bg-textLight"
                  } h-[2px] absolute w-full origin-left`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{
                    duration: 0.25,
                    // type: "spring",
                    // stiffness: 200,
                    // mass: 0.15,
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
