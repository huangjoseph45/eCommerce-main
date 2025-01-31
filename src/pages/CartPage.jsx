import { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  ProductContext,
  ProductsContext,
} from "../components/utilities/ContextManager";
import CartItemList from "../components/cart-components/cartItemsList";
import useFetchServerData from "../components/utilities/getDataFromServer";
import CartSummary from "../components/cart-components/cartSummary";

const CartPage = () => {
  const [products, setProducts] = useState([]);

  const { isLoggedIn } = useContext(ProductContext);
  const [cart, setCart] = useState([]);

  const { isLoading, data } = useFetchServerData({
    queries: ["cart"],
    auth: { isLoggedIn },
  });
  useEffect(() => {
    if (data?.cart) {
      setCart(data.cart);
    }
  }, [data]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      <Header />
      <div className="flex flex-col lg:flex-row items-start justify-between max-w-[70%] m-auto relative">
        <div className="w-2/3 mr-2">
          <h1 className="text-2xl my-2 mt-4">Bag</h1>
          {isLoading ? <p>Loading...</p> : <CartItemList cart={cart} />}
        </div>{" "}
        {cart && cart.length > 0 && !isLoading && <CartSummary />}
      </div>
      <Footer />
    </ProductsContext.Provider>
  );
};

export default CartPage;
