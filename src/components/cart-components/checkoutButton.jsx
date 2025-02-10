import { useEffect, useRef } from "react";
import useHandleCheckout from "../utilities/useHandleCheckout";

const CheckoutButton = ({ cart, products, promoCode }) => {
  const [isLoading, initiateCheckout] = useHandleCheckout();
  const checkOutData = useRef();

  const handleCheckout = () => {
    if (!cart | (cart.length < 1)) {
      return false;
    }
    checkOutData.current = cart
      .map((cartItem) => {
        if (!cartItem.sku || !cartItem.quantity) {
          return null;
        }
        try {
          const breakSKUApart = cartItem.sku.split("-");
          const SKU = breakSKUApart[0] + "-" + breakSKUApart[1];

          const matchingProduct = products.find(
            (product) => product.sku === SKU
          );

          if (!matchingProduct) return null;

          const returnObject = {
            promoCode: promoCode,
            sku: SKU,
            color: matchingProduct.color,
            size: breakSKUApart[3],
            quantity: cartItem.quantity,
          };

          console.log(returnObject);
          return returnObject;
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter((e) => e);

    initiateCheckout(checkOutData.current);
  };

  return (
    <button
      onClick={() => handleCheckout()}
      className="border rounded-md p-2  bg-bgBlack text-textLight hover:bg-bgSecondary/95 my-2 w-full hover:shadow-md"
      disabled={(cart && cart.length === 0) || isLoading}
    >
      {isLoading ? "Redirecting..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
