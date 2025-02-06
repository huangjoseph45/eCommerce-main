import { useState } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  const getProducts = async (tags) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:2000/api/products/fetch${tags ? "/" + tags : "/*"}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const refetchProducts = async (tag) => {
    return getProducts(tag);
  };

  return { isLoading, products, refetchProducts };
};

export default useFetchProducts;
