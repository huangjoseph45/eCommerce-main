import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useContext } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";

const SizesDropdown = ({ product, defaultSelector = "Select" }) => {
  const [showElement, setShowElement] = useState(false);
  const [selected, setSelected] = useState(defaultSelector);
  const { productInfo, setProductInfo } = useContext(ProductInfoContext);

  const showFunc = () => {
    setShowElement(!showElement);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowElement(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowElement(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectSize = (size) => {
    setSelected(size);
    setShowElement(false);
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      sizeInfo: size,
    }));
  };

  const sizes = product.sizes.map((size) => {
    return (
      <li
        key={size}
        className="list-none cursor-pointer hover:text-textLight hover:bg-slate-700 text-textDark text-left p-2 rounded-md pl-4 min-w-[10rem] w-full uppercase select-none"
        onClick={() => selectSize(size)}
      >
        {size}
      </li>
    );
  });

  return (
    <>
      <p className="text-lg mb-1">Size:</p>
      <div
        className="flex flex-col  items-center justify-center w-fit relative mb-6"
        ref={dropdownRef}
      >
        <div
          onClick={showFunc}
          className="handle group flex items-center justify-center bg-bgBase w-fit m-auto px-4 py-2 cursor-pointer hover:bg-bgSecondaryLight box-border border-2 border-bgSecondaryLight rounded-md"
        >
          <p
            className={`text-xl text-textDark group-hover:text-textLight select-none transition-all duration-300 ${
              selected !== defaultSelector && "uppercase"
            }`}
          >
            {selected}
          </p>
        </div>
        <AnimatePresence>
          {showElement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="flex bg-bgBase items-center m-auto flex-col gap-2 border border-textDark rounded-md w-fit p-1 absolute top-full left-0 z-20"
            >
              {sizes}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

SizesDropdown.propTypes = {
  defaultSelector: PropTypes.string, // Ensures that 'default' is a string
};

export default SizesDropdown;
