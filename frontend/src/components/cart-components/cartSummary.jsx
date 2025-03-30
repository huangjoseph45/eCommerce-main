import { useContext, useEffect, useState, useRef } from "react";
import { ProductContext } from "../utilities/ContextManager";
import CartSummaryHeader from "./cartSummaryHeader";
import { AnimatePresence, motion } from "motion/react";
import CheckoutButton from "./checkoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../utilities/useAuth";

const CartSummary = ({ products, loading = true, cart }) => {
  const { loggedIn } = useAuth();
  const { userInfo } = useContext(ProductContext);
  const [subtotalCost, setSubtotalCost] = useState(0);
  const [discount, setDiscount] = useState({
    amount: 0,
    code: "",
    show: false,
  });
  const [total, setTotal] = useState(0);
  const [discountStatus, setDiscountStatus] = useState({
    message: "",
    show: false,
    ok: false,
  });
  const tId = useRef();

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === "Enter") applyDiscount();
  };

  const handleChangeDiscount = (event) => {
    setDiscount({ ...discount, code: event.target.value });
  };

  const applyDiscount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/products/discount/${discount.code}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok || response.status === 204) {
        console.log(response);
        setDiscountStatus({
          message: "Promo Code is not available",
          show: true,
          ok: false,
        });
        return;
      }
      const data = await response.json();
      setDiscount({ ...discount, amount: data.value });
      if (data.value) {
        setDiscountStatus({
          message: "Promo Code has been successfully added",
          show: true,
          ok: true,
        });
      }
    } catch (error) {
      setDiscountStatus({
        message: "There was an error adding your promo code",
        show: true,
        ok: false,
      });
      console.error("Error: " + error);
      return;
    }
  };
  useEffect(() => {
    if (discountStatus.show) {
      if (tId.current) clearTimeout(tId.current);

      tId.current = setTimeout(() => {
        setDiscountStatus({ message: "", show: false, ok: false });
        tId.current = null;
      }, 4000);
    }

    return () => {
      if (tId.current) clearTimeout(tId.current);
    };
  }, [discountStatus.show]);

  useEffect(() => {
    setTotal(((subtotalCost * (100 - discount.amount)) / 100).toFixed(2));
  }, [subtotalCost, discount.amount]);

  useEffect(() => {
    if (userInfo && userInfo !== undefined && userInfo.cart && products) {
      let cost = 0;
      userInfo.cart.forEach((item) => {
        const sku = item.sku
          ? item.sku.split("-")[0] + "-" + item.sku.split("-")[1]
          : "";
        const product = products.find((product) => {
          const productSKU = product.sku ? product.sku.toLowerCase() : null;
          const cartSKU = sku ? sku.toLowerCase() : null;
          return productSKU === cartSKU;
        });
        if (product) {
          cost += item.quantity * product.price * (1 - product.discount / 100);
        }
      });
      setSubtotalCost(cost.toFixed(2));
    }
  }, [products, JSON.stringify(userInfo)]);
  console.log(
    loggedIn &&
      ((cart && cart.length > 0) ||
        (userInfo.cart && userInfo.cart.length > 0)) &&
      !loading
  );

  return (
    <div
      className={`min-w-[20rem] w-full max-w-[30rem] lg:max-w-[25rem] relative top-[1rem] z-10 flex-col gap-2 mt-6 lg:mt-0 cursor-pointer shadow-md p-4 rounded-md transition-all duration-200 bg-bgBase2 text-textDark min-h-[8rem] flex ${
        !loading && (cart.length == 0 || userInfo?.cart?.length == 0)
          ? "hidden"
          : ""
      } `}
    >
      {(loggedIn &&
        ((cart && cart.length > 0) ||
          (userInfo.cart && userInfo.cart.length > 0))) ||
      loading ? (
        <>
          <h1 className="font-semibold text-lg">Summary</h1>
          <button
            className="text-left font-medium relative z-2"
            onClick={() => setDiscount({ ...discount, show: !discount.show })}
          >
            Do you have a Promo Code?{" "}
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-all duration-200 ${
                discount.show && "rotate-180 "
              }`}
            />
          </button>
          <AnimatePresence>
            {discount.show && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0.95, height: 0, top: 0 }}
                animate={{
                  opacity: 1,
                  height: "5rem",
                  overflow: "hidden",
                }}
                exit={{ opacity: 0.95, height: 0 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.15,
                }}
              >
                <div className="flex flex-row gap-2 py-2 px-1 z-0 relative items-center justify-center ">
                  <input
                    type="text"
                    className="shadow-md border p-2 w-full rounded-md z-0 relative uppercase  bg-bgBase"
                    placeholder="Code"
                    value={discount.code}
                    onChange={(event) => handleChangeDiscount(event)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  <button
                    className="border px-4 p-2 rounded-full bg-bgSecondaryLight text-bgBase focus:outline focus:outline-2 focus:outline-bgExtraSecondaryLight hover:bg-bgExtraSecondaryLight transition-all duration-150 "
                    onClick={applyDiscount}
                  >
                    Apply
                  </button>
                </div>
                {discountStatus && discountStatus.show && (
                  <p
                    className={`${
                      !discountStatus.ok ? "text-errorTrue" : "text-errorFalse"
                    }`}
                  >
                    {discountStatus.message}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <CartSummaryHeader
            mainText={"Subtotal"}
            value={subtotalCost}
            zeroText={"Free"}
            loading={loading}
          />
          {discount && discount.amount > 0 && (
            <CartSummaryHeader
              mainText={"Discount"}
              prefix="-$"
              value={((subtotalCost * discount.amount) / 100).toFixed(2)}
              zeroText={"0"}
              loading={loading}
            />
          )}
          <hr />
          <CartSummaryHeader
            mainText={"Total"}
            value={total}
            zeroText={"Free"}
            loading={loading}
          />
          <hr />
          <CheckoutButton
            cart={userInfo && userInfo.cart}
            products={products}
            promoCode={discount.code}
          />
          <img
            src="https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/logo-full"
            alt=""
            className="mt-4 hidden lg:block rounded-sm"
          />
        </>
      ) : null}
    </div>
  );
};

export default CartSummary;
