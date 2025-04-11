import { motion } from "motion/react";
import { useState } from "react";

const ArrayItem = ({ item, field, onChange, index, deleteFunc }) => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <motion.li
      onHoverStart={() => {
        setShowDelete(true);
      }}
      onHoverEnd={() => {
        setShowDelete(false);
      }}
      className="relative border h-fit"
    >
      <input
        type="text"
        value={item}
        className="w-[12rem] p-1 bg-bgBase2 outline h-[2.5rem]"
        onChange={(e) => onChange(e, field, index)}
      />
      {showDelete && (
        <button
          className="absolute z-10 top-1/2 right-0 w-5 h-5 flex items-center justify-center -translate-y-1/2"
          onClick={() => deleteFunc(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 1024 1024"
            fill="#ff0000"
            className="icon"
            version="1.1"
          >
            <path
              d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z"
              fill=""
            />
            <path
              d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z"
              fill=""
            />
            <path d="M328 340.8l32-31.2 348 348-32 32z" fill="" />
            <script xmlns="" />
          </svg>
        </button>
      )}
    </motion.li>
  );
};

export default ArrayItem;
