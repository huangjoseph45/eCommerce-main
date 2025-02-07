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
import returnProduct from "../components/utilities/returnProduct";

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(ProductContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productPromises = cart.map((cartItem) => {
          return returnProduct(cartItem.sku);
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (cart && cart.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [cart]);

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
      <div className="flex flex-col lg:flex-row items-start justify-around w-[full] mx-[10rem] relative gap-8">
        <div className="w-full mr-2">
          <h1 className="text-2xl my-2 mt-4">Bag</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <CartItemList
              cart={cart}
              setCart={setCart}
              products={products}
              loading={loading}
              error={error}
            />
          )}
        </div>{" "}
        {cart && cart.length > 0 && !isLoading && (
          <CartSummary products={products} />
        )}
      </div>
      <Footer />
    </ProductsContext.Provider>
  );
};

export default CartPage;
