import { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { ProductContext } from "../components/utilities/ProductContext";
import CartItemList from "../components/cart-components/cartItemsList";

const CartPage = () => {
  const { userInfo } = useContext(ProductContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.cart) {
      setCart(userInfo.cart);
    }
  }, [userInfo]);

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row items-start justify-between max-w-[70%] m-auto relative">
        <div className="w-2/3 mr-2">
          <h1 className="text-2xl my-2 mt-4">Bag</h1>
          <CartItemList cart={cart} />
        </div>
        <div className="w-1/3 sticky top-[7rem] z-40 ">
          <h1 className="">Summary</h1>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
