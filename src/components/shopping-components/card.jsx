import PropTypes from "prop-types";
import { useMemo, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import parsePrice from "../utilities/parsePrice";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cubicBezier } from "motion";

const Card = ({
  sku,
  name,
  price,
  type,
  numPatterns,
  colors,
  discount = 0,
}) => {
  const nav = useNavigate();
  const { initialPrice, finalPrice } = parsePrice(price, discount);
  const [cardColor, setCardColor] = useState(0);
  const numImages = Array.isArray(colors) ? colors.length : 1;

  const [isShowingArrows, setShowingArrows] = useState(false);
  const [isHovering, setHovering] = useState(false);

  const toggleShowArrows = () => {
    setHovering(!isHovering);
    if (numImages > 1) setShowingArrows(!isShowingArrows);
  };

  const colorBoxes =
    colors &&
    colors.map((color, index) => {
      return (
        <>
          <div
            key={color.colorCode}
            className={`w-6 h-6 lg:w-8 lg:h-8 outline outline-1 outline-bgSecondary hover:outline-blue-400 cursor-pointer  hover:scale-[110%] transition-all shadow-md duration-150 rounded-full ${
              cardColor === index &&
              "outline-blue-500 outline-[.15rem] flex-shrink-0"
            }`}
            style={{ backgroundColor: color.colorCode }}
            onMouseEnter={() => {
              setCardColor(index);
            }}
            onClick={() => nav(`${stringURL}/${color.idMod}`)}
          ></div>
        </>
      );
    });

  const stringURL = useMemo(() => {
    const encodedName =
      name && encodeURIComponent(name.replace(/ /g, "-")).toLowerCase();
    return `/p/${encodedName}/${sku}`.toLowerCase();
  }, [name, sku]);

  const modifyCardColor = (incrementor) => {
    let newColor = cardColor + incrementor;
    if (newColor >= colors.length) {
      newColor = 0;
    }
    if (newColor < 0) {
      newColor = colors.length - 1;
    }
    setCardColor(newColor);
  };

  return (
    sku && (
      <div
        className="hover:shadow-md transition-all duration-100 rounded-sm w-full h-full max-h-[45rem] flex flex-col cursor-pointer box-border mb-2 relative hover:bg-bgBase3 bg-bgBase
"
        onMouseEnter={toggleShowArrows}
        onMouseLeave={toggleShowArrows}
      >
        <div className="relative z-[0]">
          {colors && (
            <img
              src={`https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                sku + "-" + colors &&
                colors.length > 0 &&
                colors[cardColor].idMod
              }`}
              alt={name}
              onClick={() => nav(stringURL)}
              loading="lazy"
              className="w-full select-none object-cover aspect-[4/5]"
            />
          )}

          <AnimatePresence>
            {isHovering && (
              <motion.div
                className="absolute  w-full p-[.375rem] bg-bgBase/85 bg-blur-lg z-auto xs:flex flex-row justify-between hidden"
                initial={{ translateY: 0 }}
                animate={{ translateY: "-100%" }}
                exit={{ translateY: 0 }}
                transition={{
                  duration: 0.1,
                  ease: cubicBezier(0.17, 0.54, 0.48, 0.94),
                }}
              >
                <ul className="flex flex-row gap-2 w-full overflow-auto py-2 px-4">
                  {colorBoxes}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {isShowingArrows && (
            <>
              <span
                className="absolute inset-y-1/2 left-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-bgBlack/5 shadow-md  transition-colors duration-[0.4s] filter: bg-blur-sm"
                onClick={() => modifyCardColor(-1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </span>
              <span
                className="absolute inset-y-1/2 right-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-bgBlack/5 shadow-md transition-colors duration-[0.4s] filter: bg-blur-sm"
                onClick={() => modifyCardColor(1)}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            </>
          )}
        </div>
        <Link
          to={stringURL}
          className="px-2 relative z-[10] bg-inherit h-full py-2"
        >
          <p className="font-semibold text-base">{name}</p>
          <p className="text-gray-500 text-sm">{type}</p>
          <p className="text-gray-500 text-sm">{numPatterns} Patterns</p>
          <div className="flex flex-row items-center gap-2">
            <p className="font-semibold text-lg">${finalPrice}</p>
            {discount !== 0 && (
              <p className="font-semibold text-md line-through text-gray-500">
                ${initialPrice}
              </p>
            )}
          </div>
          {discount !== 0 && (
            <p className="font-semibold text-lg text-errorFalse">
              {discount}% off
            </p>
          )}
        </Link>
      </div>
    )
  );
};

Card.propTypes = {
  sku: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  numPatterns: PropTypes.number.isRequired,
  discount: PropTypes.number,
  numImages: PropTypes.number,
};

export default Card;
