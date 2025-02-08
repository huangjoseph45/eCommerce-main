import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLinks from "./sectionlinks";
import SearchBar from "./searchBar";
import ProfileButton from "./profile-button";
import Cart from "./cart";
import SearchButton from "./search-button";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
  }, [showSidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
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
      <div className="relative ">
        <FontAwesomeIcon
          className={`text-black cursor-pointer size-8 md:size-8 mt-1 hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full lg:hidden ${
            showSidebar && "rotate-90"
          } transition-all duration-300`}
          icon={showSidebar ? faXmark : faBars}
          title={showSidebar ? "Close" : "Menu"}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <AnimatePresence>
          {showSidebar && (
            <motion.ul
              className="fixed right-0 top-0 w-full h-full bg-white p-10 text-2xl flex flex-col gap-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.2, // Applies to initial and animate by default
              }}
            >
              <FontAwesomeIcon
                className={`text-black cursor-pointer size-8 md:size-10 hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full lg:hidden $ transition-all duration-300 absolute right-2 top-6`}
                icon={faXmark}
                title={"Close"}
                onClick={() => setShowSidebar(false)}
              />
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
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Sidebar;
