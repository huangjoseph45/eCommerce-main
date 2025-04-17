import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  ProductsContext,
  ProductContext,
} from "../components/utilities/ContextManager";
import CartItemList from "../components/cart-components/cartItemsList";
import CartSummary from "../components/cart-components/cartSummary";
import useProductsForCart from "../components/utilities/getProductsForCart";
import useAuth from "../components/utilities/useAuth";
import AdditionalProducts from "../components/additionalProducts";

const CartPage = () => {
  const { loggedIn } = useAuth();
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [compLoading, setLoading] = useState(loggedIn);
  const [aggregateTags, setAggregateTags] = useState([]);
  const [loading, products, fetchProducts] = useProductsForCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading == false && (userInfo?._id || !loggedIn)) {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  }, [loading]);

  useEffect(() => {
    console.log(userInfo);
    if (userInfo?.cart) setCart(userInfo.cart);
  }, [JSON.stringify(userInfo)]);

  useEffect(() => {
    if (cart) {
      fetchProducts({ cart });
    }
  }, [cart]);

  useEffect(() => {
    if (!loading && products && products.length > 0) {
      let filteredTags = [];
      products.forEach((product) => {
        product.tags.forEach((tag) => {
          if (!filteredTags.includes(tag)) {
            filteredTags.push(tag);
          }
        });
      });
      setAggregateTags(filteredTags);
    }
  }, [products, loading]);

  return (
    <ProductsContext.Provider value={{ products }}>
      <Header />
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-around w-[full] mx-4 md:mx-[4rem] lg:mx-[4rem] xl:mx-[17%] relative gap-8">
        <div className="w-full mr-2">
          <CartItemList
            cart={cart}
            setCart={setCart}
            products={products}
            loading={compLoading}
            error={error}
            userInfo={userInfo}
          />
        </div>{" "}
        <CartSummary products={products} loading={compLoading} cart={cart} />
      </div>
      <div className="mx-auto mt-24">
        {aggregateTags && aggregateTags.length > 0 ? (
          <AdditionalProducts
            tags={aggregateTags}
            ignoreSKUList={cart.map(
              (item) => item.sku.split("-")[0] + "-" + item.sku.split("-")[1]
            )}
          />
        ) : (
          <AdditionalProducts tags={[""]} ignoreSKUList={[]} />
        )}
      </div>

      <Footer />
    </ProductsContext.Provider>
  );
};

export default CartPage;
