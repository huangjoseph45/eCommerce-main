import { useContext, useEffect, useState, useRef } from "react";
import { ShowProfileContext } from "../utilities/ContextManager";
import { AnimatePresence, motion } from "motion/react";
import useLogout from "../utilities/useLogout";

const sectionItem = {
  variants: {
    closed: { opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { duration: 0.2 },
};

const SettingsSectionsList = ({ sections, setSection }) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);
  const [show, setShow] = useState(false);
  const [loading, result, tryLogout] = useLogout();
  const [hasMounted, setHasMounted] = useState(false);
  const prevWidth = useRef(window.innerWidth);

  const checkSize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 50 + prevWidth || windowWidth < prevWidth - 50) {
      prevWidth.current = window.innerWidth;
      if (windowWidth >= 1024) {
        document.body.style.overflow = "scroll";
        setShowProfileHeaders(true);
      } else {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    setHasMounted(true);
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showProfileHeaders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 10);

    document.body.style.overflow =
      window.innerWidth < 1024 && showProfileHeaders ? "hidden" : "scroll";

    return () => {
      clearTimeout(timer);
    };
  }, [showProfileHeaders]);

  const accountSections = sections.map((section, index) => {
    return (
      <motion.li
        key={section.svg + index}
        {...sectionItem}
        className="list-none cursor-pointer h-14 transition-all duration-100 flex items-center justify-between  text-center lg:text-left w-full lg:hover:underline"
        onClick={() => {
          setSection(index);
          if (window.innerWidth < 1024) {
            setShowProfileHeaders(false);
          }
        }}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="absolute h-8 w-8 flex items-center justify-center">
            {" "}
            {section.svg}
          </div>
          <h2 className="mx-[36px]"> {section.name}</h2>
        </div>

        <button className="lg:hidden rotate-180 rounded-full p-2">
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="24px"
            height="24px"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M15.525 18.966L8.558 12l6.967-6.967"
            ></path>
          </svg>
        </button>
      </motion.li>
    );
  });

  return (
    <>
      <AnimatePresence>
        {showProfileHeaders && (
          <motion.div
            initial={
              hasMounted
                ? {
                    opacity: 0.5,
                    scale: 1,
                    x: `${window.innerWidth < 1024 ? "100%" : "0"}`,

                    transition: {
                      delay: 0.5,
                    },
                  }
                : {
                    x: "0%",

                    opacity: 1,

                    scale: 1,
                  }
            }
            animate={{
              x: "0%",

              opacity: 1,

              scale: 1,
            }}
            exit={{
              x: `${window.innerWidth < 1024 ? "100%" : "0"}`,
            }}
            transition={{ duration: 0.3, type: "tween" }}
            className="flex flex-col w-full lg:w-[16rem]  mr-12 p-4 mt-28 lg:mt-[4rem] absolute bg-bgBase lg:bg-none lg:static top-[0rem] overscroll-contain items-center lg:items-start z-30 h-full lg:h-fit lg:ml-6 lg:border-r lg:border-r-1 lg:justify-start lg:text-lg text-base sm:text-lg md:text-xl"
          >
            <div className="w-[95%] sm:w-[85%]">
              {" "}
              <div className="relative lg:hidden h-[2rem]  mb-8 ">
                <a
                  className="absolute left-0 rounded-full top-1/2 -translate-y-1/2"
                  href="/"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    role="img"
                    width="24px"
                    height="24px"
                    fill="none"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      d="M15.525 18.966L8.558 12l6.967-6.967"
                    ></path>
                  </svg>
                </a>
                <h1 className="lg:hidden text-2xl flex items-center justify-center">
                  Settings
                </h1>
              </div>
              <ul className=" lg:min-w-0  lg:w-[14rem]">
                {show && accountSections}
                <motion.div
                  className="min-w-20 cursor-pointer  h-14 transition-all duration-100 flex items-center  text-center lg:text-left"
                  {...sectionItem}
                  onClick={() => tryLogout()}
                >
                  <div className="w-full flex gap-2 items-center ">
                    <div className=" w-8 h-8 flex items-center justify-center">
                      {loading ? (
                        <div className="loader size-8"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28px"
                          height="28px"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 12H19M19 12L16 15M19 12L16 9"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <script xmlns="" />
                        </svg>
                      )}
                    </div>

                    <p>Log Out</p>
                  </div>
                </motion.div>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsSectionsList;
