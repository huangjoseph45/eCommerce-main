import { useEffect, useState } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState();

  const getProducts = async (
    tags,
    filter = null,
    enableTest = false,
    cursor = 0
  ) => {
    try {
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
          }),
        }
      );
      const data = await response.json();
      let products = data.products;
      // if (Array.isArray(products) && products.length > 0) {
      //   products = products.sort((a, b) => {
      //     const { newest, lowToHigh, highToLow } = filter?.sort || {};

      //     if (newest) return sortProducts(a, b, "newest");
      //     if (lowToHigh) return sortProducts(a, b, "lowToHigh");
      //     if (highToLow) return sortProducts(a, b, "highToLow");

      //     return sortProducts(a, b, "newest");
      //   });
      // }
      setTimeout(() => {
        setProducts(products);
        setLoading(false);
      }, Math.random() * 500 + 200 - (Date.now() - then) || 0);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const refetchProducts = async (tag, filter = null, enableTest, cursor) => {
    getProducts(tag, filter, enableTest, cursor);
  };

  return [isLoading, products, refetchProducts];
};

export default useFetchProducts;

const sortProducts = (a, b, sortType) => {
  const compareIds = (a, b) => a._id.localeCompare(b._id);
  const aTime = new Date(a.createdAt).getTime();
  const bTime = new Date(b.createdAt).getTime();

  if (sortType === "newest") {
    return bTime - aTime || compareIds(a, b);
  } else if (sortType === "highToLow") {
    return a.price - b.price || compareIds(a, b);
  } else if (sortType === "lowToHigh") {
    return b.price - a.price || compareIds(a, b);
  }

  return compareIds(a, b); // default sort by _id
};
