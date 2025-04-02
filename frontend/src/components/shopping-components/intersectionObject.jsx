import { useRef, useEffect, useState } from "react";
import useFetchProducts from "../utilities/useFetchMultipleProducts";

const IntersectionObject = ({
  products,
  loading,
  setCursor,
  sortingInfo,
  cursor,
  fetchQuery,
  filter,
}) => {
  const cursorIncrement = parseInt(import.meta.env.VITE_CURSOR_INCREMENT);
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const observerRef = useRef();
  const oldProducts = useRef();
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isLoading, nextProducts, refetchProducts] = useFetchProducts();

  useEffect(() => {
    if (!observerRef.current) return;

    const observerOptions = {
      threshold: 0.7,
    };

    const observerCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (loading) return;
          oldProducts.current = products;
          setCursor((prevCursor) => prevCursor + parseInt(cursorIncrement));
          obs.unobserve(entry.target);
        } else {
          setIsAtEnd(false);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect();
    };
  }, [loading, products, cursorIncrement]);

  useEffect(() => {
    if (!nextProducts) return;
    if (
      !isLoading &&
      nextProducts &&
      nextProducts.length > 0 &&
      products &&
      products.length > 0 &&
      JSON.stringify(nextProducts) === JSON.stringify(products)
    ) {
      setIsAtEnd(true);
    }
  }, [nextProducts, isLoading, fetchQuery]);

  useEffect(() => {
    refetchProducts(
      fetchQuery,
      sortingInfo,
      enableTest,
      cursor + cursorIncrement
    );
  }, [cursor]);

  useEffect(() => {
    setIsAtEnd(false);
  }, [sortingInfo]);

  return !isAtEnd &&
    fetchQuery &&
    !loading &&
    products &&
    products.length > 0 &&
    products[0].sku ? (
    <div
      className="absolute w-full h-[5rem] translate-y-[10rem] "
      ref={observerRef}
    ></div>
  ) : (
    !isAtEnd && products && products.length > 0 && products[0].sku && (
      <p className="loader mx-auto my-16"></p>
    )
  );
};

export default IntersectionObject;
