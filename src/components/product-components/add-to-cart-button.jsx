import { useContext, useCallback } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { ProductContext } from "../utilities/ContextManager";
import isEmpty from "../utilities/isEmpty";

const AddToCart = () => {
  const { productInfo } = useContext(ProductInfoContext);
  const { userInfo, setUserInfo } = useContext(ProductContext);

  const addToCartFunction = useCallback(() => {
    if (!isEmpty(productInfo.sizeInfo) && !isEmpty(productInfo.colorInfo)) {
      const cartInfo = structuredClone(productInfo);
      const fullId = `${cartInfo.productId}-${cartInfo.colorInfo.idMod}-${cartInfo.sizeInfo}`;
      const itemIndex = userInfo.cart.findIndex(
        (cartItem) => cartItem.productId === fullId
      );

      const updatedCart =
        itemIndex === -1
          ? [...userInfo.cart, { productId: fullId, quantity: 1 }]
          : userInfo.cart.map((item, index) =>
              index === itemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );

      setUserInfo({
        ...userInfo,
        cart: updatedCart,
      });
    }
  }, [productInfo, setUserInfo, userInfo]);

  return (
    <button
      className="bg-slate-900 text-white w-[90%] p-3 text-sm hover:bg-slate-800 hover:scale-[102.5%] transition-all duration-0.3 mb-8"
      onClick={addToCartFunction}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
