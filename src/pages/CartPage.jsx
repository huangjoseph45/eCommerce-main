import { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  ProductContext,
  ProductsContext,
} from "../components/utilities/ContextManager";
import CartItemList from "../components/cart-components/cartItemsList";
import getDataFromServer from "../components/utilities/getDataFromServer";
import CartSummary from "../components/cart-components/cartSummary";

const CartPage = () => {
  const [products, setProducts] = useState([]);

  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getFromServer = async () => {
      const serverData = await getDataFromServer({ setUserInfo, userInfo });
      setCart(serverData.cart);
    };
    getFromServer();
  }, []);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      <Header />
      <div className="flex flex-col lg:flex-row items-start justify-between max-w-[70%] m-auto relative">
        <div className="w-2/3 mr-2">
          <h1 className="text-2xl my-2 mt-4">Bag</h1>
          <CartItemList cart={cart} />
        </div>{" "}
        {cart.length > 0 && <CartSummary />}
      </div>
      <Footer />
    </ProductsContext.Provider>
  );
};

export default CartPage;
