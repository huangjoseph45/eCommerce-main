import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Logo from "./logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faXmark,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isSearching, setIsSearching }) => {
  const [value, setValue] = useState("");
  const searchRef = useRef();
  const nav = useNavigate();

  const handleSubmit = () => {
    if (value.trim()) {
      nav(`/search?q=${encodeURIComponent(value)}`);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    setValue("");

    const checkEscape = (e) => {
      if (e.key === "Escape") {
        setTimeout(() => {
          if (isSearching) setIsSearching(false);
        }, 50);
      }
    };

    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setTimeout(() => {
          if (isSearching) setIsSearching(false);
        }, 50);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSearching(false);
      }
    };

    window.addEventListener("keydown", checkEscape);
    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", checkEscape);
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSearching]);

  const checkHideBar = () => {
    setTimeout(() => {
      if (isSearching) setIsSearching(false);
    }, 50);
  };

  return (
    <AnimatePresence>
      {isSearching && (
        <motion.div
          ref={searchRef}
          initial={
            window.innerWidth > 1024
              ? {
                  opacity: 0.5,
                  scale: 1,
                  y: "-100%",
                  x: "-50%",
                }
              : {
                  opacity: 0.5,
                  scale: 1,
                  x: "100%",
                }
          }
          animate={
            window.innerWidth > 1024
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, x: 0 }
          }
          exit={
            window.innerWidth > 1024
              ? { opacity: 0.5, scale: 1, y: "-100%" }
              : { opacity: 0.5, scale: 1, x: "100%" }
          }
          transition={{
            duration: 0.15, // Applies to initial and animate by default
          }}
          className="bg-white -top-[4rem] lg:top-0 absolute border left-0 lg:left-1/2 w-screen lg:w-full  flex items-center justify-center p-2 h-[100vh] lg:h-[25vh] translate-x-0"
        >
          <div className="absolute top-0 left-0 p-4">
            <Logo />
          </div>
          <div className="absolute top-[5rem] lg:top-0 w-full flex items-center justify-center p-4">
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 h-full box-border cursor-pointer aspect-square rounded-md hover:bg-gray-300 text-gray-400 flex items-center justify-center"
                onClick={handleSubmit}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  role="img"
                  width="24px"
                  height="24px"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"
                  ></path>
                </svg>
              </button>

              <input
                className="hover:bg-gray-200 bg-gray-100 px-4 py-2 rounded-md min-w-[20rem] w-[60vw] lg:w-1/2 text-start max-w-[64rem] z-2 pl-12 outline-none"
                placeholder={"Search"}
                autoFocus={false}
                onBlur={(e) => checkHideBar(e)}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            </div>
          </div>
          <div className="absolute left-[85%] lg:left-[95%] p-4 top-0">
            <FontAwesomeIcon
              icon={window.innerWidth > 1024 ? faXmark : faChevronRight}
              size="lg"
              className="text-black  h-8 aspect-square rounded-full cursor-pointer hover:bg-gray-300 transition-all duration-200 bg-opacity-55"
              onClick={checkHideBar}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
