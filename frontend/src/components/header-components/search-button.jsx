import { motion } from "motion/react";

const SearchButton = ({ setSearch }) => {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.5 }}
        title="Search"
        onClick={() => setSearch(true)}
        className="cursor-pointer aspect-square  hover:bg-slate-500 hover:bg-opacity-25 p-2 rounded-full hover:text-bgTertiary size-12 2xl:size-[4.5rem]"
      >
        {" "}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          fill="none"
          className="w-full h-full"
        >
          <path
            stroke="currentColor"
            strokeWidth="1"
            d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"
          ></path>
        </svg>
      </motion.div>
    </>
  );
};

export default SearchButton;
