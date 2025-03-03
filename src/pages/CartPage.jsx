import { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  ProductsContext,
  ProductContext,
} from "../components/utilities/ContextManager";
import CartItemList from "../components/cart-components/cartItemsList";
import CartSummary from "../components/cart-components/cartSummary";
import useProductsForCart from "../components/utilities/getProductsForCart";

const CartPage = () => {
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const { userInfo } = useContext(ProductContext);
  const [loading, products, fetchProducts] = useProductsForCart();

  useEffect(() => {
    if (userInfo && userInfo.cart) setCart(userInfo.cart);
  }, [JSON.stringify(userInfo)]);

  useEffect(() => {
    if (cart) {
      fetchProducts({ cart });
    }
  }, [cart]);

  return (
    <ProductsContext.Provider value={{ products }}>
      <Header />
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-around w-[full] mx-4 md:mx-[4rem] lg:mx-[10rem] xl:mx-[17%] relative gap-8">
        <div className="w-full mr-2">
          <CartItemList
            cart={cart}
            setCart={setCart}
            products={products}
            loading={loading}
            error={error}
          />
        </div>{" "}
        {cart && cart.length > 0 && (
          <CartSummary products={products} loading={loading} />
        )}
      </div>
      <Footer />
    </ProductsContext.Provider>
  );
};

export default CartPage;
