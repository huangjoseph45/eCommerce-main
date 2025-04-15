import { useEffect, useState, useRef } from "react";
import CardPlaceHolder from "../shopping-components/cardPlaceholder";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const FeaturedCard = ({ section, index, thisProduct }) => {
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const nav = useNavigate();
  const [imgSrc, setImgSrc] = useState(null);
  const middleElement = useRef(null);
  const [isHovering, setHovering] = useState(false);
  console.log(section);

  useEffect(() => {
    if (thisProduct) {
      setImgSrc(
        `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${section.imageURLExtension}`
      );
    }
  }, [thisProduct]);

  return (
    <div ref={middleElement} className="flex flex-col cursor-pointer">
      {thisProduct ? (
        <>
          <motion.div
            className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden  hover:shadow-lg transition-all duration-200 "
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
          >
            <h1 className="absolute z-20 text-textLight capitalize p-2 text-4xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {section.sectionTitle}
            </h1>
            <div className="relative h-full w-full hover:scale-105 duration-300 transition-all">
              <img
                src={imgSrc ? imgSrc : null}
                alt=""
                className={`object-top object-cover w-full h-full `}
              />
              <AnimatePresence>
                {" "}
                {isHovering && (
                  <motion.button
                    initial={{ scale: 0, left: "50%", translateX: "-50%" }}
                    animate={{ scale: 1, left: "50%" }}
                    exit={{ scale: 0, left: "50%" }}
                    transition={{ type: "spring", stiffness: 200, mass: 0.3 }}
                    className="outline z-10 border bottom-[4rem] absolute p-2 px-8 rounded-sm bg-bgBase hover:bg-bgBase3"
                    onClick={() => nav("/" + section.slug)}
                  >
                    Shop Now
                  </motion.button>
                )}
              </AnimatePresence>

              <span className="absolute top-0  left-0 bg-[#362709]/15 w-full h-full"></span>
            </div>
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
