import { useEffect, useState } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState();

  const getProducts = async (tags, filter = null) => {
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
      let products = data.products;

      if (Array.isArray(products) && products.length > 0) {
        if (filter.prices) {
          products = products.filter((product) => {
            const productPrice =
              product.price *
              (1 -
                (product.discount < 1
                  ? product.discount
                  : product.discount / 100));
            return Object.keys(filter.prices).some((key) => {
              const range = key.split("-");
              if (range.length === 2) {
                const min = parseInt(range[0], 10);
                const max = parseInt(range[1], 10);

                return (
                  productPrice >= min &&
                  productPrice <= max &&
                  filter.prices[key]
                );
              }
              if (key === "100+") {
                console.log(filter.prices[key]);
                return productPrice >= 100 && filter.prices[key];
              }
              return false;
            });
          });
        }
        products = products.sort((a, b) => {
          const { newest, lowToHigh, highToLow } = filter?.sort || {};

          if (newest) return sortProducts(a, b, "newest");
          if (lowToHigh) return sortProducts(a, b, "lowToHigh");
          if (highToLow) return sortProducts(a, b, "highToLow");

          return sortProducts(a, b, "newest");
        });
      }
      setProducts(products);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const refetchProducts = async (tag, filter = null) => {
    getProducts(tag, filter);
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
