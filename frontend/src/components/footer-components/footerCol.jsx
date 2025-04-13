import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const FooterCol = ({ children, colName }) => {
  const [show, setShow] = useState(window.innerWidth > 640);
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const resizeFunc = () => {
      if (
        window.innerWidth - 25 > prevWidth.current ||
        window.innerWidth + 25 < prevWidth.current
      ) {
        prevWidth.current = window.innerWidth;
        setShow(window.innerWidth > 640);
      }
    };
    resizeFunc();
    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, []);

  return (
    <div className="flex flex-col pl-6 lg:pl-8 w-fit sm:mb-8 pb-4">
      <div className="mb-4 relative w-fit">
        <div
          className="flex flex-row items-center  "
          onClick={() => {
            if (window.innerWidth < 640) {
              setShow(!show);
            }
          }}
        >
          <h2 className="cursor-pointer sm:cursor-default ">{colName}</h2>
          <div
            className={`scale-y-150 scale-x-125 transition-all duration-150 ${
              show ? "rotate-90" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g id="Arrow / Caret_Right_SM">
                <path
                  id="Vector"
                  d="M11 9L14 12L11 15"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <script xmlns="" />
            </svg>
          </div>
        </div>
        <hr className="w-2/3 mt-1 border border-bgTertiary" />
      </div>
      <AnimatePresence>
        {show && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring" }}
            className="gap-2 flex flex-col overflow-hidden"
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FooterCol;
