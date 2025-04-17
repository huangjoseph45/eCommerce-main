import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useContext } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";

const menu = {
  closed: {
    height: 0,
    width: 0,
    padding: 0,
    border: "0px solid oklch(92.2% 0 0)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      damping: 20,
    },
  },
  open: {
    height: "auto",
    width: "auto",
    padding: ".25rem",
    border: "1px solid oklch(92.2% 0 0)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

const item = {
  variants: {
    closed: { x: -4, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
};

const SizesDropdown = ({
  product,
  defaultSelector = "Select",
  urlSize = null,
  highlightSize,
  setHighlightSize,
}) => {
  const nav = useNavigate();
  const [showElement, setShowElement] = useState(false);
  const [selected, setSelected] = useState(urlSize || defaultSelector);
  const { productInfo } = useContext(ProductInfoContext);

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

    setSelected(urlSize || defaultSelector);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [urlSize]);
  const selectSize = (size) => {
    setHighlightSize(false);
    nav(
      `/p/${product?.productName}/${product?.sku}/${productInfo.colorInfo.idMod}/${size}`
    );
    setShowElement(false);
  };

  const sizes = product?.sizes.map((size) => {
    return (
      <motion.li
        {...item}
        key={size}
        className="snap-center list-none cursor-pointer hover:bg-slate-100 text-textDark text-center p-2 rounded-sm  w-[3rem] uppercase select-none"
        onClick={() => selectSize(size)}
      >
        {size}
      </motion.li>
    );
  });

  return (
    <>
      <p className={`text-base mb-1 ${highlightSize ? "text-red-500" : ""}`}>
        Size:
      </p>
      <div
        className="flex flex-col items-start justify-start w-fit relative mb-6"
        ref={dropdownRef}
      >
        <div
          onClick={showFunc}
          className={`drop-shadow-md handle group flex items-center justify-center bg-bgBase w-fit px-4 py-2 cursor-pointer hover:bg-bgSecondaryLight box-border border rounded-sm ${
            highlightSize
              ? "outline outline-red-500 outline-offset-[3px] rounded-sm"
              : ""
          }`}
        >
          <p
            className={` text-lg text-textDark group-hover:text-textLight select-none transition-all duration-300 ${
              selected !== defaultSelector && "uppercase"
            }`}
          >
            {selected}
          </p>
        </div>
        <AnimatePresence>
          {showElement && (
            <motion.ul
              variants={menu}
              initial="closed"
              animate={"open"}
              exit={"closed"}
              className="origin-top-left grid grid-cols-3 grid-flow-row bg-bgBase items-center gap-2 shadow-md rounded-sm w-fit p-1 z-10  h-full snap-mandatory snap-y scrollbar-hide"
            >
              {sizes}
            </motion.ul>
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
