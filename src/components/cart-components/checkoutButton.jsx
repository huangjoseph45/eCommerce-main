import { useEffect, useRef } from "react";
import useHandleCheckout from "../utilities/useHandleCheckout";

const CheckoutButton = ({ cart, products }) => {
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

          console.log(matchingProduct);
          if (
            !matchingProduct ||
            !matchingProduct.stripePriceId ||
            !matchingProduct.stripeProductId
          )
            return null;

          const returnObject = {
            sku: SKU,
            color: matchingProduct.color,
            size: breakSKUApart[3],
            priceId: matchingProduct.stripePriceId,
            quantity: cartItem.quantity,
            stripeProductId: matchingProduct.stripeProductId,
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
      className="border rounded-md p-2 border-black bg-black text-white hover:bg-slate-950/90 my-2 w-full hover:shadow-md"
      disabled={(cart && cart.length === 0) || isLoading}
    >
      {isLoading ? "Redirecting..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
