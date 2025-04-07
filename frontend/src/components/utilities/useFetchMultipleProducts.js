import { useEffect, useState } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState();

  const getProducts = async (
    tags,
    filter = null,
    enableTest = false,
    cursor = 0,
    isSearch = false
  ) => {
    try {
      console.log(isSearch);

      const then = Date.now();
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/products/fetch`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test: enableTest,
            tags: tags,
            cursor: cursor,
            filter: {
              sort: filter.sort,
              prices: filter.prices,
            },
            isSearch: isSearch,
          }),
        }
      );
      const data = await response.json();
      let products = data.products;
      setTimeout(() => {
        setProducts(products);
        setLoading(false);
      }, Math.random() * 500 + 200 - (Date.now() - then) || 0);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const refetchProducts = async (
    tag,
    filter = null,
    enableTest,
    cursor,
    isSearch
  ) => {
    getProducts(tag, filter, enableTest, cursor, isSearch);
  };

  return [isLoading, products, refetchProducts];
};

export default useFetchProducts;
