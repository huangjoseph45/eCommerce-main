import { useContext, useCallback, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { ProductContext } from "../utilities/ContextManager";
import isEmpty from "../utilities/isEmpty";
import { useNavigate } from "react-router-dom";
import useUpdateServerData from "../utilities/updateServerData";

const AddToCart = ({ product }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [showPopup, setShowPopup] = useState(false);
  const nav = useNavigate();
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });

  const addToCartFunction = useCallback(() => {
    const cookies = document.cookie;
    if (!cookies.includes("sessionId")) {
      nav("/login");
    }
    if (!isEmpty(productInfo.sizeInfo) && !isEmpty(productInfo.colorInfo)) {
      const cartInfo = structuredClone(productInfo);
      const fullId = `${cartInfo.sku}-${cartInfo.colorInfo.idMod}-${cartInfo.sizeInfo}`;
      const itemIndex = userInfo.cart.findIndex(
        (cartItem) => cartItem.sku === fullId
      );
      console.log(cartInfo);

      const updatedCart =
        itemIndex === -1
          ? [...userInfo.cart, { sku: fullId, quantity: 1 }]
          : userInfo.cart.map((item, index) =>
              index === itemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );

      const cachedInfo = JSON.parse(sessionStorage.getItem("userInfo")) || null;

      if (cachedInfo) {
        const updatedInfo = { ...cachedInfo, cart: updatedCart };
        sessionStorage.setItem("userInfo", JSON.stringify(updatedInfo));
      }
      setUserInfo({ ...userInfo, cart: updatedCart });
      refetch({ cart: updatedCart });
      setShowPopup(true);
    }
  }, [productInfo, setUserInfo, userInfo]);

  useEffect(() => {
    let timeoutId;
    if (showPopup === true) {
      timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, [3000]);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  return (
    <>
      {showPopup && (
        <span
          className={
            "fixed bottom-[1rem] right-[1rem] bg-bgBase shadow-md border rounded-full p-3 cursor-pointer"
          }
        >
          Added to Cart
        </span>
      )}
      <button
        className="rounded-lg bg-slate-50 text-black w-[90%] p-3 text-sm hover:bg-bgSecondary hover:text-textLight outline outline-2 outline-bgSecondary hover:scale-[102.5%] transition-all duration-0.3 mb-8"
        onClick={addToCartFunction}
      >
        Add to Cart
      </button>
    </>
  );
};

export default AddToCart;
