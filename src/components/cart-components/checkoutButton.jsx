import { useState, useRef } from "react";
import useHandleCheckout from "../utilities/useHandleCheckout";

const CheckoutButton = ({ cart, products, promoCode = null }) => {
  const [isLoading, initiateCheckout] = useHandleCheckout();
  const [overCapacity, setOverCapacity] = useState(false);
  const maxCapacity = 50;
  const checkOutData = useRef();
  const handleCheckout = () => {
    if (!cart | (cart.length < 1)) {
      return false;
    }
    if (cart.length > maxCapacity) {
      setOverCapacity(true);
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

          const matchingProduct = products.find((product) => {
            const productSKU = product.sku ? product.sku.toLowerCase() : null;
            const cartSKU = SKU ? SKU.toLowerCase() : null;
            return productSKU === cartSKU;
          });

          const colorId = cartItem.sku.split("-")[2];
          const color = products.find(
            (product) => product.color.idMod === colorId
          ).color;

          if (!matchingProduct) return null;
          const returnObject = {
            promoCode: promoCode,
            sku: SKU,
            color: color,
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
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("userDetails");

    initiateCheckout(checkOutData.current);
  };

  return (
    <>
      <button
        onClick={() => handleCheckout()}
        className="border rounded-md p-2 bg-bgBlack text-textLight hover:bg-bgSecondary/95 my-2 w-full hover:shadow-md flex items-center justify-center gap-2"
        disabled={(cart && cart.length === 0) || isLoading}
      >
        {isLoading ? (
          <>
            Redirecting{" "}
            <div className="loader border border-textLight border-[2px] h-4 w-4"></div>
          </>
        ) : (
          "Checkout"
        )}
      </button>
      {overCapacity && (
        <div
          className="text-errorTrue bg-errorTrue/15 p-2 rounded-md"
          onClick={() => setOverCapacity(false)}
        >
          Your cart is full! Please remove some items to continue.
        </div>
      )}
    </>
  );
};

export default CheckoutButton;
