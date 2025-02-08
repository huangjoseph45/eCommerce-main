import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import parsePrice from "../utilities/parsePrice";
import { Link, useNavigate } from "react-router-dom";

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
  const toggleShowArrows = () => {
    if (numImages > 1) setShowingArrows(!isShowingArrows);
  };

  const stringURL = useMemo(() => {
    const encodedName = encodeURIComponent(
      name.replace(/ /g, "-")
    ).toLowerCase();
    return `/${encodedName}/${sku}`.toLowerCase();
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
    <div
      className="hover:shadow-md transition-all duration-100 rounded-sm w-full h-fit flex flex-col gap-1 cursor-pointer box-border pb-2 relative z-0 
"
      onMouseEnter={toggleShowArrows}
      onMouseLeave={toggleShowArrows}
    >
      <div className="relative">
        <img
          src={`https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
            sku + "-" + colors[cardColor].idMod
          }`}
          alt={name}
          onClick={() => nav(stringURL)}
          loading="lazy"
          className="w-full  select-none object-cover aspect-[3/4]"
        />

        {isShowingArrows && (
          <>
            <span
              className="absolute inset-y-1/2 left-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-black/10 shadow-md  transition-colors duration-[0.4s] filter: bg-blur-sm"
              onClick={() => modifyCardColor(-1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </span>
            <span
              className="absolute inset-y-1/2 right-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-black/10 shadow-md transition-colors duration-[0.4s] filter: bg-blur-sm"
              onClick={() => modifyCardColor(1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
          </>
        )}
      </div>
      <Link to={stringURL} className="px-2">
        <p className="font-semibold text-xl">{name}</p>
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
          <p className="font-semibold text-lg text-green-600">
            {discount}% off
          </p>
        )}
      </Link>
    </div>
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
