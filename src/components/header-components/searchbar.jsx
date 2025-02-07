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

const SearchBar = ({
  isSearching,
  setIsSearching,
  setSideBarVisible = () => {},
}) => {
  const [value, setValue] = useState("");
  const storedSearches = JSON.parse(sessionStorage.getItem("storedSearches"));
  const [pastSearches, setPastSearches] = useState(
    storedSearches ? JSON.parse(sessionStorage.getItem("storedSearches")) : []
  );
  const searchRef = useRef();
  const nav = useNavigate();

  const handleSubmit = () => {
    if (value.trim()) {
      setPastSearches([...pastSearches, value]);
      setSideBarVisible(false);
      sessionStorage.setItem(
        "storedSearches",
        JSON.stringify([...pastSearches, value])
      );
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
        <>
          {" "}
          <motion.div
            ref={searchRef}
            initial={
              window.innerWidth > 1024
                ? {
                    opacity: 0.5,
                    scale: 1,
                    x: "-50%",
                    y: "-100%",
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
              duration: 0.1, // Applies to initial and animate by default
            }}
            className=" -top-[4rem] lg:top-0 fixed left-0 lg:left-1/2 w-screen lg:w-full flex justify-center p-2 h-[120vh] lg:h-[25vh] min-h-[13rem] z-10 bg-white"
          >
            <div className="absolute top-0 left-0 p-4">
              <Logo />
            </div>
            <div className=" absolute top-[5rem] lg:top-0 w-full flex items-center px-4 lg:justify-center pt-4">
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
                  className="hover:bg-gray-200 bg-gray-100 px-4 py-2 rounded-md min-w-[15rem] w-[80vw] lg:w-[30vw] text-start max-w-[64rem] z-2 pl-12 outline-none"
                  placeholder={"Search"}
                  autoFocus={false}
                  onBlur={(e) => checkHideBar(e)}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </div>
            </div>
            <div className="absolute top-[5rem] lg:top-0 w-fit flex items-center justify-center pt-4 right-0 xs:right-4 -translate-x-1/3">
              <FontAwesomeIcon
                icon={window.innerWidth > 1024 ? faXmark : faChevronRight}
                size="lg"
                className=" text-black p-2 h-8 aspect-square rounded-full cursor-pointer hover:bg-black/10 shadow-md transition-all duration-200 bg-opacity-55"
                onClick={checkHideBar}
              />
            </div>
            <div className="flex flex-col w-full ml-[6rem] lg:ml-0 mt-[10rem] lg:mt-[4rem] px-4 ">
              <h1 className="text-lg">Your Searches</h1>
              <ul className="grid grid-rows-2 grid-flow-col gap-2 w-fit">
                {pastSearches &&
                  pastSearches.map((search, index) => (
                    <li
                      key={`${search}-${index}`}
                      onClick={() => {
                        setSideBarVisible(false);
                        setIsSearching(false);
                        nav(`/search?q=${encodeURIComponent(search)}`);
                      }}
                      className="p-2 border rounded w-fit shadow-md cursor-pointer"
                    >
                      {search}
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
          <div className="content-[''] w-[100vw] h-[100vh] fixed bg-black/30 top-0 left-0 -z-10 box-border border-none"></div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
