import { useEffect, useState } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState();

  const getProducts = async (tags) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/products/fetch${
          tags ? "/" + tags : "/*"
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const refetchProducts = async (tag) => {
    getProducts(tag);
  };

  return [isLoading, products, refetchProducts];
};

export default useFetchProducts;
