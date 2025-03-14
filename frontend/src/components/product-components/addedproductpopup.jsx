import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useContext } from "react";
import { ProductContext } from "../utilities/ContextManager";
import { createPortal } from "react-dom";
import parsePrice from "../utilities/parsePrice";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import useDynamicComponent from "../utilities/useDynamicComponent";

const ELEMENT_SIZE_REM = 20;

const ProductPopup = ({
  setShowPopup,
  showPopup,
  product,
  productInfo,
  addToCartFunction,
}) => {
  useDynamicComponent({ setVisible: setShowPopup });
  const imgSrc =
    product?.sku && productInfo?.colorInfo?.idMod
      ? `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          product.sku + "-" + productInfo.colorInfo.idMod
        }`
      : "";
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    console.log();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktop]);

  const productPrice = parsePrice(product?.price, product?.discount);
  const nav = useNavigate();
  console.log(isDesktop);

  return createPortal(
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{
            scale: 0,
            y: "-100%",
            x: `${
              isDesktop ? `${window.innerWidth - ELEMENT_SIZE_REM * 16}px` : 0
            }`,
          }}
          animate={{
            scale: 1,
            y: "-1rem",
            x: `${
              isDesktop ? `${window.innerWidth - ELEMENT_SIZE_REM * 16}px` : 0
            }`,
          }}
          exit={{
            scale: 0,
            y: "-100%",
            x: `${
              isDesktop ? `${window.innerWidth - ELEMENT_SIZE_REM * 16}px` : 0
            }`,
          }}
          transition={{
            type: "spring",
            mass: 0.5,
          }}
          className={`fixed -top-[1rem] bg-bgBase shadow-md  cursor-pointer pt-[8rem] p-3 rounded-b-xl px-6 w-full md:w-[20rem] z-20 `}
        >
          <div className="w-full justify-center items-center flex flex-col gap-2  mx-auto">
            <div className="flex items-center gap-2 py-2  w-full">
              <svg
                aria-hidden="true"
                className="text-errorFalse"
                focusable="false"
                viewBox="0 0 24 24"
                role="img"
                width="24px"
                height="24px"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zm-1.06 14l-3.18-3.18 1.06-1.06 2.12 2.12 4.24-4.24 1.06 1.06-5.3 5.3z"
                ></path>
              </svg>
              <p className="font-medium">Added to Bag</p>
              <div
                className={`cursor-pointer absolute top-[7rem] right-0 p-2 rounded-full m-4 hover:bg-bgBlack/15 transition-all duration-150`}
                title={"Close"}
                onClick={() => setShowPopup(false)}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  role="img"
                  width="28px"
                  height="28px"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <img src={imgSrc} alt={productInfo?.sku} className="h-[6.5rem]" />
              <div className="flex flex-col gap-1">
                <p className="truncate w-2/3">{product?.productName}</p>
                <p className="text-textHollow">{product?.type}</p>
                <p className="text-textHollow">
                  {productInfo?.colorInfo?.colorName ?? "error"}/
                  {productInfo?.sizeInfo ?? "error"}
                </p>
                <p>${productPrice.finalPrice}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Button
                buttonText="View Bag"
                buttonFunc={() => nav("/cart")}
              ></Button>
              <Button
                invert={true}
                buttonText="Add More"
                buttonFunc={addToCartFunction}
              ></Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductPopup;
