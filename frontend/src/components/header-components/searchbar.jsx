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
import useDynamicComponent from "../utilities/useDynamicComponent";
import { createPortal } from "react-dom";

const SearchBar = ({
  isSearching,
  setIsSearching,
  setSideBarVisible = () => {},
}) => {
  useDynamicComponent({ setVisible: setIsSearching });
  const [value, setValue] = useState("");
  const storedSearches = JSON.parse(sessionStorage.getItem("storedSearches"));
  const [pastSearches, setPastSearches] = useState(
    storedSearches ? JSON.parse(sessionStorage.getItem("storedSearches")) : []
  );
  const nav = useNavigate();

  const handleSubmit = () => {
    if (value.trim()) {
      let searchesList = pastSearches;
      if (!searchesList.includes(value.trim())) {
        console.log("not includes");
        searchesList = [...pastSearches, value];
      }
      if (searchesList.length > 10) {
        console.log(pastSearches.slice(0, 10));
        searchesList = searchesList.slice(-10);
      }
      setPastSearches(searchesList);
      setSideBarVisible(false);
      sessionStorage.setItem("storedSearches", JSON.stringify(searchesList));
      nav(`/search?q=${encodeURIComponent(value)}`);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const checkHideBar = () => {
    setTimeout(() => {
      if (isSearching) setIsSearching(false);
    }, 50);
  };

  return createPortal(
    <AnimatePresence>
      {isSearching && (
        <>
          <motion.div
            onClick={() => setIsSearching(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="w-screen h-screen bg-none backdrop-blur-sm fixed top-0 z-30 bg-bgSecondary/5"
          ></motion.div>
          <motion.div
            initial={
              window.innerWidth > 1024
                ? {
                    opacity: 0,
                    scale: 1,
                    x: "-50%",
                    y: "-100%",
                  }
                : {
                    opacity: 0,
                    scale: 1,
                    x: "100%",
                  }
            }
            animate={
              window.innerWidth > 1024
                ? { opacity: 1, scale: 1, y: -20 }
                : { opacity: 1, scale: 1, x: 0 }
            }
            exit={
              window.innerWidth > 1024
                ? { opacity: 0, scale: 1, y: "-100%" }
                : { opacity: 0, scale: 1, x: "100%" }
            }
            transition={{
              duration: 0.15,
            }}
            className="-top-[4rem] lg:top-0 fixed left-0 lg:left-1/2 w-screen lg:w-full flex justify-center p-2 h-[120vh] lg:h-[15rem] bg-bgBase z-40"
          >
            <div className="absolute top-4 left-0 h-12 mt-4 p-2 ml-2 hidden lg:block">
              <Logo />
            </div>
            <div className=" absolute top-[5rem] lg:top-4 w-full flex items-center px-4 lg:justify-center mt-4 h-12">
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-full box-border cursor-pointer aspect-square rounded-md  bg-bgSecondary/5 text-textHollow flex items-center justify-center"
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
                  className="focus:bg-bgSecondary/10 bg-bgSecondary/5 px-4 py-2 rounded-md min-w-[12rem] w-[80vw] lg:w-[30vw] text-start max-w-[64rem] z-2 pl-14 outline-none"
                  placeholder={"Search"}
                  autoFocus={false}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </div>
            </div>
            <div className="absolute top-[5rem] lg:top-4 mt-4 right-4 h-12 flex items-center justify-center">
              <FontAwesomeIcon
                icon={window.innerWidth > 1024 ? faXmark : faChevronRight}
                size="lg"
                className=" text-textDark p-2 h-4 aspect-square rounded-full cursor-pointer hover:bg-bgBlack/10 shadow-md transition-all duration-200 bg-opacity-55"
                onClick={checkHideBar}
              />
            </div>
            <div className="flex flex-col w-full lg:ml-0 mt-[10rem] lg:mt-[5rem] px-2">
              <h1 className="text-lg">Your Searches</h1>
              <ul className="grid grid-rows-2 grid-flow-col gap-2 w-fit">
                {pastSearches &&
                  pastSearches.map((searchValue, index) => (
                    <li
                      key={`${searchValue}-${index}`}
                      onClick={() => {
                        setSideBarVisible(false);
                        setIsSearching(false);
                        nav(`/search?q=${encodeURIComponent(searchValue)}`);
                      }}
                      className="p-2 border rounded  shadow-md cursor-pointer hover:scale-105 transition-all duration-200 hover:bg-bgBlack/5  justify-center items-center h-fit max-w-[5rem] overflow-hidden text-ellipsis text-nowrap block"
                    >
                      {searchValue}
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SearchBar;
