// CartItem.js
import React, { memo, useEffect, useState, useRef } from "react";
import ProductQuantity from "./productQuantity";
import { useNavigate } from "react-router-dom";

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
    deleteFunc,
  }) => {
    const nav = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const deleteItem = () => {
      setIsVisible(false);
    };

    const baseId = useRef();

    useEffect(() => {
      if (sku !== undefined && sku.includes("-")) {
        baseId.current = sku.split("-")[0];
      }
    }, [sku]);

    const stringURL = (
      encodeURIComponent(productName.replace(" ", "-")) +
      "/" +
      baseId.current
    ).toLowerCase();

    return (
      isVisible && (
        <li className="list-none py-2">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {imageLink && (
                <img
                  onClick={() => nav("/" + stringURL)}
                  src={imageLink}
                  alt={productName}
                  className="w-[16rem] object-cover cursor-pointer"
                />
              )}{" "}
              <ProductQuantity
                quantity={quantity}
                sku={sku}
                deleteFunc={deleteItem}
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="flex flex-row w-full justify-between pr-4">
                <a
                  onClick={() => nav("/" + stringURL)}
                  className="text-lg font-semibold cursor-pointer"
                >
                  {productName}
                </a>
                <div className="flex flex-row gap-4">
                  {discount && (
                    <p className="text-gray-700 line-through">
                      ${price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-black">
                    ${(price * (1 - discount / 100)).toFixed(2)}
                  </p>{" "}
                </div>
              </div>
              <p className="capitalize text-gray-600">{type}</p>
              <p className="capitalize text-gray-600">
                {color && color.colorName && color.colorName}
              </p>
              <p className="uppercase text-gray-600">{size}</p>
            </div>
          </div>
        </li>
      )
    );
  }
);

// Assign a displayName for better debugging and to satisfy ESLint
CartItem.displayName = "CartItem";

export default CartItem;
