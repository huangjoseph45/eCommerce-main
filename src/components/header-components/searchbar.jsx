import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = () => {};

  const handleKeyPress = (event) => {
    if (event.key === "enter") {
      console.log("Entered");
    }
  };

  const toggleSearchBar = () => {
    setValue("");
    setIsSearching(!isSearching);
  };

  const checkHideBar = () => {
    setTimeout(() => {
      if (isSearching) setIsSearching(false);
    }, 100);
  };

  return (
    <>
      <FontAwesomeIcon
        className="text-black cursor-pointer size-8 md:size-6  hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full relative"
        title="Search"
        icon={faSearch}
        onClick={() => toggleSearchBar()}
      />
      <AnimatePresence>
        {isSearching && (
          <motion.input
            initial={{ opacity: 0, scale: 0.95, y: 0, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 16 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{
              duration: 0.1, // Applies to initial and animate by default
              exit: { duration: 0.5 }, // Longer exit transition
            }}
            className="absolute top-full left-1/2 transform translate-y-4 border border-slate-700 px-4 py-2 rounded-full w-1/2 text-center text selection:bg-blue-300 outline-blue-400 max-w-[64rem] z-2"
            placeholder="Search"
            autoFocus={true}
            onBlur={() => checkHideBar()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => handleKeyPress(e)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
