import { useState } from "react";
import {
  demoProductsForTags,
  demoProductsForSearch,
  markDemoCatalog,
  clearDemoCatalog,
} from "../../data/demoCatalog";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState();

  // Demo fallback: the products the shop grid shows when the live backend
  // is unreachable. Search queries match against name, type, and tags.
  const demoFallback = (tags, isSearch) => {
    const demo = isSearch
      ? demoProductsForSearch(tags?.[0])
      : demoProductsForTags(tags, 8);
    markDemoCatalog();
    setProducts(demo);
    setLoading(false);
  };

  const getProducts = async (
    tags,
    filter = null,
    enableTest = false,
    cursor = 0,
    isSearch = false
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
            isSearch: isSearch,
          }),
        }
      );
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        demoFallback(tags, isSearch);
        return;
      }
      const data = await response.json();
      let products = data.products;
      clearDemoCatalog();
      setTimeout(() => {
        setProducts(products);
        setLoading(false);
      }, Math.random() * 500 + 200 - (Date.now() - then) || 0);
    } catch (e) {
      console.warn("Live backend unreachable, serving demo products:", e);
      demoFallback(tags, isSearch);
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
