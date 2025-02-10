import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../utilities/ContextManager";
import CartSummaryHeader from "./cartSummaryHeader";
import { AnimatePresence, motion } from "motion/react";
import CheckoutButton from "./checkoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CartSummary = ({ products }) => {
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
    let tID;

    if (discountStatus.show) {
      tID = setTimeout(() => {
        setDiscountStatus({ message: "", show: false, ok: false });
      }, 4000);
    }

    return () => {
      if (tID) clearTimeout(tID);
    };
  }, [discountStatus.show]);

  useEffect(() => {
    setTotal(((subtotalCost * (100 - discount.amount)) / 100).toFixed(2));
  }, [subtotalCost, discount.amount]);

  useEffect(() => {
    if (userInfo && userInfo !== undefined && userInfo.cart && products) {
      let cost = 0;
      userInfo.cart.forEach((item) => {
        const sku = item.sku.split("-")[0] + "-" + item.sku.split("-")[1];
        const product = products.find((product) => product.sku === sku);
        if (product)
          cost += item.quantity * product.price * (1 - product.discount / 100);
      });
      setSubtotalCost(cost.toFixed(2));
    }
  }, [products, userInfo?.cart]);

  return (
    userInfo &&
    userInfo.cart &&
    userInfo.cart.length > 0 && (
      <div className="min-w-[20rem] w-full max-w-[30rem] lg:max-w-[25rem] sticky top-[7rem] z-10 flex flex-col gap-2 mt-6 lg:mt-0 cursor-pointer hover:shadow-md p-4 rounded-sm transition-all duration-200">
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
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-row gap-2 pb-2 z-0 relative">
                <input
                  type="text"
                  className="shadow-md border p-2 w-full rounded-md z-0 relative uppercase"
                  value={discount.code}
                  onChange={(event) => handleChangeDiscount(event)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <button
                  className="border px-4 p-2 rounded-full bg-bgSecondaryLight text-bgBase hover:bgExtraSecondaryLight transition-all duration-150 "
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
        />

        <hr />
        <CartSummaryHeader mainText={"Total"} value={total} zeroText={"Free"} />
        <hr />
        <CheckoutButton
          cart={userInfo && userInfo.cart}
          products={products}
          promoCode={discount.code}
        />
      </div>
    )
  );
};

export default CartSummary;
