import { useContext, useCallback, useState, useEffect, useRef } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { ProductContext } from "../utilities/ContextManager";
import isEmpty from "../utilities/isEmpty";
import useUpdateServerData from "../utilities/updateServerData";
import Button from "../button";
import ProductPopup from "./addedproductpopup";
import useAuth from "../utilities/useAuth";
import LoginModal from "../loginModal";
import { motion, AnimatePresence } from "motion/react";
import useUpdateSEO from "../utilities/useUpdateSEO";

const AddToCart = ({ product, scrollToSize }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [showPopup, setShowPopup] = useState(false);
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });
  const { loggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(true);
  const [loading, updateSEO] = useUpdateSEO();
  const observerRef = useRef();

  const [popupProduct, setPopupProduct] = useState();

  useEffect(() => {
    if (!observerRef.current) return;

    const observerOptions = {
      threshold: 0.7,
    };

    const observerCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowFixedButton(false);
        } else {
          setShowFixedButton(true);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect();
    };
  }, []);

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

      updateSEO({ sku: product.sku, SEOValue: 5 });

      setUserInfo({ ...userInfo, cart: updatedCart });
      refetch({ cart: updatedCart });
      setPopupProduct({ product: product, productInfo: productInfo });
      setShowPopup(true);
    } else {
      scrollToSize();
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
      <div className="" ref={observerRef}>
        <Button
          buttonFunc={addToCartFunction}
          invert={true}
          buttonText={"Add to Cart"}
        />
      </div>
      <AnimatePresence>
        {showFixedButton && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              mass: 0.2,
            }}
            className="fixed bottom-0 w-full flex  gap-0 md:hidden left-0 z-[19]"
          >
            <button
              className="w-full h-16   flex justify-center items-center text-xl bg-bgSecondary hover:bg-bgSecondaryLight transition-colors duration-150 text-textLight "
              onClick={addToCartFunction}
            >
              Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToCart;
