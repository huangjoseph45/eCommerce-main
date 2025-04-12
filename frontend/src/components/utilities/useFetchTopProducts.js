import { useState } from "react";

const useFetchTopProducts = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  const getProducts = async ({
    enableTest,
    tagArray,
    numProductsPerTag,
    strictSelection = true,
  }) => {
    try {
      const then = Date.now();
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/products/fetch-top`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test: enableTest,
            tagArray: tagArray,
            numProductsPerTag: numProductsPerTag,
            strict: strictSelection,
          }),
        }
      );
      const data = await response.json();

      setTimeout(() => {
        setProducts(data.foundProducts);
        setLoading(false);
      }, Math.random() * 500 + 200 - (Date.now() - then) || 0);
      return data.foundProducts;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return [loading, products, getProducts];
};

export default useFetchTopProducts;
