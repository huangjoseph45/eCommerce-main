import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../utilities/ContextManager";
import CartSummaryHeader from "./cartSummaryHeader";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "./checkoutButton";

const CartSummary = ({ products }) => {
  const { userInfo } = useContext(ProductContext);
  const [subtotalCost, setSubtotalCost] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(25);
  const [tax, setTax] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);

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
      <div className="min-w-[20rem] w-full max-w-[30rem] sticky top-[7rem] z-10 flex flex-col gap-2 mt-6 lg:mt-0 cursor-pointer hover:shadow-md p-4 rounded-sm transition-all duration-200">
        <h1 className="font-semibold text-lg">Summary</h1>
        <CartSummaryHeader
          mainText={"Subtotal"}
          value={subtotalCost}
          zeroText={"Free"}
        />
        <CartSummaryHeader
          mainText={`${"Est. Shipping & Handling"}`}
          value={shippingPrice}
          zeroText={"Free"}
        />{" "}
        <CartSummaryHeader
          mainText={"Estimated Tax"}
          value={tax}
          zeroText={
            <p className="text-lg scale-x-[300%] -translate-x-1/2">-</p>
          }
        />
        {globalDiscount !== 0 && (
          <CartSummaryHeader
            mainText={"Discount"}
            value={globalDiscount}
            zeroText={0}
            type="%"
          />
        )}
        <hr />
        <CartSummaryHeader
          mainText={"Total"}
          value={((subtotalCost * (100 - globalDiscount)) / 100).toFixed(2)}
          zeroText={"Free"}
        />
        <hr />
        <CheckoutButton cart={userInfo && userInfo.cart} products={products} />
      </div>
    )
  );
};

export default CartSummary;
