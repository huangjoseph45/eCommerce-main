import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import parsePrice from "./utilities/parsePrice";
import { Link } from "react-router-dom";

const Card = ({
  id,
  name,
  price,
  type,
  numPatterns,
  colors,
  discount = 0,
  numImages = 1,
}) => {
  const { initialPrice, finalPrice } = parsePrice(price, discount);

  const [isShowingArrows, setShowingArrows] = useState(false);
  const toggleShowArrows = () => {
    if (numImages > 1) setShowingArrows(!isShowingArrows);
  };

  const stringURL = (
    encodeURIComponent(name.replace(" ", "-")) +
    "/" +
    id
  ).toLowerCase();

  return (
    <Link
      id={id}
      to={stringURL}
      className="rounded-sm w-full h-fit flex flex-col gap-1 px-2 cursor-pointer box-border hover:outline hover:outline-slate-300 hover:outline-1 pb-2 relative z-0
"
      onMouseEnter={toggleShowArrows}
      onMouseLeave={toggleShowArrows}
    >
      <div className="relative">
        <img
          src={`https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
            id + "-" + colors[0].idMod
          }`}
          alt={name}
          loading="lazy"
          className="h-fit select-none"
        />
        {isShowingArrows && (
          <>
            <span className="absolute inset-y-1/2 left-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-[0.4s]">
              <FontAwesomeIcon icon={faChevronLeft} />
            </span>
            <span className="absolute inset-y-1/2 right-2  w-4 h-4 p-4 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-[0.4s]">
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
          </>
        )}
      </div>

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
        <p className="font-semibold text-lg text-green-600">{discount}% off</p>
      )}
    </Link>
  );
};

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  numPatterns: PropTypes.number.isRequired,
  discount: PropTypes.number,
  numImages: PropTypes.number,
};

export default Card;
