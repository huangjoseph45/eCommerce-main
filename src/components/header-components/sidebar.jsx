import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLinks from "./sectionlinks";
import SearchBar from "./searchBar";
import ProfileButton from "./profile-button";
import Cart from "./cart";
import SearchButton from "./search-button";
import { ProductContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";
import isLoggedIn from "../utilities/isLoggedIn";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const nav = useNavigate();
  const { userInfo } = useContext(ProductContext);
  const sections = [
    {
      categoryName: "New Arrivals",
      href: "new",
      id: 0,
    },
    {
      categoryName: "Men",
      href: "men",
      id: 1,
    },
    {
      categoryName: "Women",
      href: "women",
      id: 2,
    },
    {
      categoryName: "Children",
      href: "children",
      id: 3,
    },
  ];

  const sectionElements = SectionLinks(sections, setShowSidebar);

  useEffect(() => {
    setIsSearching(false);
    document.body.style.overflow =
      window.innerWidth < 1024 && showSidebar ? "hidden" : "scroll";
  }, [showSidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Escape" && !isSearching) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="">
        <FontAwesomeIcon
          className={`text-textDark cursor-pointer size-8 md:size-8 mt-1 hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full lg:hidden ${
            showSidebar && "rotate-90"
          } transition-all duration-300`}
          icon={showSidebar ? faXmark : faBars}
          title={showSidebar ? "Close" : "Menu"}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <AnimatePresence>
          {showSidebar && (
            <>
              <motion.div
                className="w-full right-0 -top-[2rem] bg-bgBlack/35 absolute h-[110vh] z-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3, // Applies to initial and animate by default
                }}
              ></motion.div>
              <motion.ul
                className="fixed right-0 top-0 w-[20rem] h-full bg-bgBase p-10 text-xl flex flex-col gap-4"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  duration: 0.15, // Applies to initial and animate by default
                }}
              >
                <div
                  className={`text-textDark cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2 rounded-full lg:hidden transition-all duration-300 relative left-[14rem] flex aspect-square w-fit`}
                  title={"Close"}
                  onClick={() => setShowSidebar(false)}
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
                      d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
                    ></path>
                  </svg>
                </div>
                {isLoggedIn ? (
                  <div
                    className="text-2xl text-bgExtraSecondaryLight cursor-pointer hover:text-bgExtraSecondaryLight/60"
                    onClick={() => nav("/profile")}
                  >
                    Welcome, {userInfo.firstName}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pb-4">
                    <p> Become a Member or Login Today</p>
                    <div className="flex flex-row gap-2">
                      <button
                        className="w-fit rounded-full px-4 py-2 bg-bgSecondary text-textLight text-base"
                        onClick={() => nav(`/login?q=sign-up`)}
                      >
                        Join Us
                      </button>
                      <button
                        className="w-fit rounded-full px-4 py-2 bg-bgBase text-textDark outline outline-1 outline-gray-400 text-base"
                        onClick={() => nav("/login")}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
                {sectionElements}
                <div className="absolute top-[90%] flex gap-3 sm:gap-4 items-center justify-between w-full box-border left-0 px-8">
                  <SearchButton setSearch={setIsSearching} />
                  <Cart />
                  <ProfileButton />
                </div>
                <SearchBar
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  setSideBarVisible={setShowSidebar}
                />
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Sidebar;
