import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useContext } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.15,
      staggerChildren: 0.05,
    },
  },
};

const item = {
  variants: {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
};

const SizesDropdown = ({
  product,
  defaultSelector = "Select",
  urlSize = null,
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
        className="list-none cursor-pointer hover:text-textLight hover:bg-slate-700 text-textDark text-left p-2 rounded-md pl-4 min-w-[10rem] w-full uppercase select-none"
        onClick={() => selectSize(size)}
      >
        {size}
      </motion.li>
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
          className="handle group flex items-center justify-center bg-bgBase w-fit m-auto px-4 py-2 cursor-pointer hover:bg-bgSecondaryLight box-border outline  border-bgSecondaryLight rounded-md"
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
              variants={menu}
              initial="closed"
              animate={showElement ? "open" : "closed"}
              exit={"closed"}
              className="mt-2 flex bg-bgBase items-center m-auto flex-col gap-2 border border-textDark rounded-md w-fit p-1 absolute top-full left-0 z-10 overflow-scroll max-h-[12rem]"
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
