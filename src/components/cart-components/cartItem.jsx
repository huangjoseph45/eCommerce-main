// CartItem.js
import React, { memo, useState } from "react";
import ProductQuantity from "./ProductQuantity";

const CartItem = memo(
  ({
    productId,
    imageLink,
    productName,
    quantity,
    price,
    discount,
    color,
    type,
    size,
    deleteFunc,
  }) => {
    const [isVisible, setIsVisible] = useState(true);
    const deleteItem = () => {
      setIsVisible(false);
    };
    return (
      isVisible && (
        <li className="list-none py-2">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {imageLink && (
                <img
                  src={imageLink}
                  alt={productName}
                  className="w-32 object-cover"
                />
              )}{" "}
              <ProductQuantity
                quantity={quantity}
                productId={productId}
                deleteFunc={deleteItem}
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="flex flex-row w-full justify-between pr-4">
                <h3 className="text-lg font-semibold">{productName}</h3>
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
              <p className="capitalize text-gray-600">{color.colorName}</p>
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
