import { useEffect, useState, useRef } from "react";
import CardPlaceHolder from "../shopping-components/cardPlaceholder";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const FeaturedCard = ({
  section,
  index,
  thisProduct,
  isHovering,
  setHovering,
}) => {
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const nav = useNavigate();
  const [imgSrc, setImgSrc] = useState(null);
  const middleElement = useRef(null);
  const [isSmallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    if (thisProduct) {
      setImgSrc(
        `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${section.imageURLExtension}`
      );
    }

    const resizeFunc = () => {
      if (window.innerWidth < 1024) {
        setHovering(true);
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }
    };
    window.addEventListener("resize", resizeFunc);
    resizeFunc();

    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  }, [thisProduct]);

  return (
    <div ref={middleElement} className="flex flex-col cursor-pointer">
      {thisProduct ? (
        <>
          <motion.div
            className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden  hover:shadow-lg transition-all duration-200 "
            onHoverStart={() => {
              if (window.innerWidth > 1024) setHovering(index);
            }}
            onHoverEnd={() => {
              if (window.innerWidth > 1024) setHovering();
            }}
            onClick={() => {
              if (window.innerWidth < 1024) setHovering(index);
            }}
          >
            <h1 className="absolute z-[5] text-textLight capitalize p-2 text-4xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {section.sectionTitle}
            </h1>
            <motion.div
              className="relative h-full w-full hover:scale-105"
              initial={{ scale: 1 }}
              animate={isHovering === index ? { scale: 1.05 } : { scale: 1 }}
              transition={{ ease: "easeInOut" }}
            >
              <img
                src={imgSrc ? imgSrc : null}
                alt=""
                className={`object-top object-cover w-full h-full `}
              />
              <AnimatePresence>
                {" "}
                {(isHovering === index || isSmallScreen) && (
                  <motion.button
                    initial={{ scale: 0.4, left: "50%", translateX: "-50%" }}
                    animate={{ scale: 1, left: "50%" }}
                    exit={{ scale: 0, left: "50%" }}
                    transition={{ type: "spring", stiffness: 200, mass: 0.2 }}
                    className=" z-[5]  bottom-[4rem] absolute p-2 px-8 rounded-sm bg-bgBase hover:bg-bgBase3 shadow-lg border border-b-[.2rem] border-r-[.2rem] border-gray-300 "
                    onClick={() => nav("/" + section.slug)}
                  >
                    Shop Now
                  </motion.button>
                )}
              </AnimatePresence>

              <span className="absolute top-0  left-0 bg-[#362709]/15 w-full h-full"></span>
            </motion.div>
          </motion.div>
        </>
      ) : (
        <div className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden">
          <CardPlaceHolder showText={false} />{" "}
        </div>
      )}
    </div>
  );
};

export default FeaturedCard;
