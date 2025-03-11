import { useContext, useCallback, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { ProductContext } from "../utilities/ContextManager";
import isEmpty from "../utilities/isEmpty";
import { useNavigate } from "react-router-dom";
import useUpdateServerData from "../utilities/updateServerData";
import Button from "../button";
import ProductPopup from "./addedproductpopup";
import isLoggedIn from "../utilities/isLoggedIn";
import LoginModal from "../loginModal";

const AddToCart = ({ product }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [showPopup, setShowPopup] = useState(false);
  const nav = useNavigate();
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });
  const loggedIn = isLoggedIn();
  const [showLogin, setShowLogin] = useState(false);

  const [popupProduct, setPopupProduct] = useState();

  const addToCartFunction = useCallback(() => {
    if (!loggedIn) {
      setShowLogin(true);
      return;
    }
    if (!isEmpty(productInfo.sizeInfo) && !isEmpty(productInfo.colorInfo)) {
      const cartInfo = structuredClone(productInfo);
      const fullId = `${cartInfo.sku}-${cartInfo.colorInfo.idMod}-${cartInfo.sizeInfo}`;
      const itemIndex = userInfo.cart.findIndex(
        (cartItem) => cartItem.sku === fullId
      );

      const updatedCart =
        itemIndex === -1
          ? [...userInfo.cart, { sku: fullId, quantity: 1 }]
          : userInfo.cart.map((item, index) =>
              index === itemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );

      setUserInfo({ ...userInfo, cart: updatedCart });
      refetch({ cart: updatedCart });
      setPopupProduct({ product: product, productInfo: productInfo });
      setShowPopup(true);
    }
  }, [productInfo, setUserInfo, userInfo]);

  useEffect(() => {
    let timeoutId;
    if (showPopup === true) {
      timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, [10000]);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup, JSON.stringify(userInfo)]);

  return (
    <>
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
      <ProductPopup
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        product={popupProduct?.product}
        productInfo={popupProduct?.productInfo}
        addToCartFunction={addToCartFunction}
      />
      <Button
        buttonFunc={addToCartFunction}
        invert={false}
        buttonText={"Add to Cart"}
      />
    </>
  );
};

export default AddToCart;
