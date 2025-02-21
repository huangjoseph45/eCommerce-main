import { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { ProductsContext } from "../components/utilities/ContextManager";
import CartItemList from "../components/cart-components/cartItemsList";
import CartSummary from "../components/cart-components/cartSummary";
import returnProduct from "../components/utilities/returnProduct";
import useProductsForCart from "../components/utilities/getProductsForCart";

const CartPage = () => {
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, products, fetchProducts] = useProductsForCart();
  const cachedInfo = JSON.parse(sessionStorage.getItem("userInfo")) || null;

  useEffect(() => {
    if (cart) fetchProducts({ cart });
  }, [cart]);

  useEffect(() => {
    if (cachedInfo?.cart) {
      setCart(cachedInfo.cart);
    }
  }, [JSON.stringify(cachedInfo)]);

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
