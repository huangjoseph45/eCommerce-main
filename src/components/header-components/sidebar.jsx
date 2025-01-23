import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLinks from "./sectionlinks";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const sections = [
    {
      categoryName: "New Arrivals",
      href: "#",
      id: 0,
    },
    {
      categoryName: "Men",
      href: "#",
      id: 1,
    },
    {
      categoryName: "Women",
      href: "#",
      id: 2,
    },
    {
      categoryName: "Children",
      href: "#",
      id: 3,
    },
  ];

  const sectionElements = SectionLinks(sections);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <FontAwesomeIcon
          className={`text-black cursor-pointer size-8 md:size-10 hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full lg:hidden ${
            showSidebar && "rotate-90"
          } transition-all duration-300`}
          icon={showSidebar ? faXmark : faBars}
          title={showSidebar ? "Close" : "Menu"}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <AnimatePresence>
          {showSidebar && (
            <motion.ul
              className="fixed right-0 top-25 w-full h-full bg-white p-10 text-2xl flex flex-col gap-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.2, // Applies to initial and animate by default
              }}
            >
              {sectionElements}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Sidebar;
