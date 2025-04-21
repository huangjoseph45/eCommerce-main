import { motion } from "motion/react";

const Button = ({
  buttonFunc,
  invert = false,
  buttonText,
  loading = false,
  large = true,
}) => {
  return (
    <motion.button
      initial={{ scale: 1 }}
      whileTap={{ y: 5 }}
      className={`rounded-md shadow-sm flex items-center justify-center w-full h-[2rem] ${
        large ? "px-4 py-[.75rem]" : "px-2 py-[.5rem]"
      }  min-h-10 scale-110 text-base outline outline-1 transition-all duration-0.3 ${
        invert
          ? " bg-bgBlack text-textLight hover:bg-bgSecondary/80 hover:outline-bgSecondary/80 outline-bgSecondary"
          : "hover:bg-bgSecondary bg-bgBase text-black  hover:text-textLight outline-bgSecondary"
      } `}
      onClick={buttonFunc}
    >
      {loading ? (
        <div className="mx-auto loader border border-textLight border-[2px] h-4 w-4"></div>
      ) : (
        buttonText
      )}
    </motion.button>
  );
};

export default Button;
