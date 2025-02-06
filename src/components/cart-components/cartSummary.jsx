import { useContext, useEffect, useState } from "react";
import { ProductsContext, ProductContext } from "../utilities/ContextManager";
import CartSummaryHeader from "./cartSummaryHeader";

const CartSummary = () => {
  const { products, setProducts } = useContext(ProductsContext);
  const { userInfo } = useContext(ProductContext);
  const [subtotalCost, setSubtotalCost] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(25);
  const [tax, setTax] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);

  useEffect(() => {
    if (userInfo && userInfo !== undefined && userInfo.cart && products) {
      let cost = 0;
      userInfo.cart.forEach((item) => {
        const sku = item.sku.split("-")[0];
        const product = products.find((product) => product.id === sku);
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
      <div className="lg:w-1/3 sticky top-[7rem] z-40 flex flex-col gap-2 w-full mt-6 lg:mt-0">
        <h1 className="font-semibold text-lg">Summary</h1>
        <CartSummaryHeader
          mainText={"Subtotal"}
          value={subtotalCost}
          zeroText={"Free"}
        />
        <CartSummaryHeader
          mainText={"Estimated Shipping & Handling"}
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
      </div>
    )
  );
};

export default CartSummary;
