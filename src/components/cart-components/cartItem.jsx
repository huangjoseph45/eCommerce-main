// CartItem.js
import React, { memo, useMemo, useEffect, useState, useRef } from "react";
import ProductQuantity from "./productQuantity";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

const cartItemVariant = {
  visible: {
    x: 0,
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    x: "-100%",
  },
};

const CartItem = memo(
  ({
    sku,
    imageLink,
    productName,
    quantity,
    price,
    discount,
    color,
    type,
    size,
    description,
    sidebar = false,
  }) => {
    const nav = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const deleteItem = (sku, isLoading) => {
      setIsVisible(false);
    };

    const baseId = useMemo(() => {
      return sku && sku.includes("-")
        ? sku.split("-")[0] + "-" + sku.split("-")[1]
        : "";
    }, [sku]);

    const stringURL = (
      "p/" +
      encodeURIComponent(productName.replace(/ /g, "-")) +
      "/" +
      baseId
    ).toLowerCase();

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.li
            variants={cartItemVariant}
            initial={"closed"}
            animate={isVisible ? "visible" : "hidden"}
            exit={"hidden"}
            className="relative list-none h-fit flex w-fit sm:w-[25rem] lg:w-[30rem]"
          >
            <div className="flex gap-2 justify-centers items-start">
              <div
                className={`flex flex-col  ${
                  sidebar
                    ? "h-[7rem]"
                    : "w-[7rem] sm:w-[8rem] lg:w-[9rem] xl:w-[10rem] h-full"
                } aspect-square lg:aspect-[3/4]`}
              >
                {imageLink && (
                  <img
                    onClick={() => nav("/" + stringURL)}
                    src={imageLink}
                    alt={productName}
                    className="object-cover cursor-pointer h-full"
                  />
                )}{" "}
              </div>

              <div
                className={`w-full h-full flex flex-col lg:gap-1 ${
                  !sidebar ? "pt-2" : "text-sm"
                }`}
              >
                <div className="flex flex-row w-full justify-between relative">
                  <a
                    onClick={() => nav("/" + stringURL)}
                    className="text-base sm:text-lg font-semibold cursor-pointer"
                  >
                    {productName}
                  </a>
                  <div className="right-0 flex flex-col items-end">
                    {discount && discount > 0 ? (
                      <p className="text-gray-700 line-through">
                        ${price.toFixed(2)}
                      </p>
                    ) : (
                      ""
                    )}
                    <p className="text-textDark">
                      ${(price * (1 - discount / 100)).toFixed(2)}
                    </p>{" "}
                  </div>
                </div>
                <p className="capitalize text-gray-600">{type}</p>
                <div className="flex lg:flex-col flex-row gap-1 mb-2">
                  <p className="capitalize text-gray-600">
                    {color && color.colorName && color.colorName}
                  </p>
                  <p className="lg:hidden">&#47;</p>
                  <p className="uppercase text-gray-600">{size}</p>
                </div>
                <div className="h-full w-full flex items-end">
                  <ProductQuantity
                    quantity={quantity}
                    sku={sku}
                    deleteFunc={deleteItem}
                  />
                </div>
              </div>
            </div>
          </motion.li>
        )}
      </AnimatePresence>
    );
  }
);

// Assign a displayName for better debugging and to satisfy ESLint
CartItem.displayName = "CartItem";

export default CartItem;
