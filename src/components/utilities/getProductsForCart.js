import { cache, useEffect } from "react";
import returnProduct from "../utilities/returnProduct";
import { useState } from "react";

const useProductsForCart = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";

  const fetchProducts = async ({ cart }) => {
    try {
      setLoading(true);

      const productPromises = cart.map((cartItem) => {
        return returnProduct(cartItem.sku, enableTest);
      });

      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  return [loading, products, fetchProducts];
};

export default useProductsForCart;
