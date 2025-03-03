import { useRef, useEffect, useState, useCallback } from "react";

const IntersectionObject = ({
  products,
  isLoading,
  loadingBuffer,
  setCursor,
  sortingInfo,
}) => {
  const observerRef = useRef();
  const intersectingState = useRef(false);
  const oldProducts = useRef();
  const [isAtEnd, setIsAtEnd] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    if (!observerRef.current) return;

    const observerOptions = {
      threshold: 1,
    };

    const observerCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !intersectingState.current) {
          oldProducts.current = products;
          intersectingState.current = true;
          setCursor(
            (prevCursor) =>
              prevCursor + parseInt(import.meta.env.VITE_CURSOR_INCREMENT)
          );
          obs.unobserve(entry.target);
        } else if (oldProducts.current === products) {
          setTimeout(() => {
            counter.current = counter.current + 1;
          }, 100);

          console.log(counter.current);
          if (counter.current >= 10) {
            setIsAtEnd(true);
          }
        } else {
          intersectingState.current = false;
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
  });

  useEffect(() => {
    setIsAtEnd(false);
  }, [sortingInfo]);

  console.log(isAtEnd);

  return !isAtEnd &&
    !loadingBuffer &&
    !isLoading &&
    products &&
    products.length > 0 &&
    products[0].sku ? (
    <div className="w-full h-[5rem]" ref={observerRef}></div>
  ) : (
    !isAtEnd && products && products.length > 0 && products[0].sku && (
      <p className="loader mx-auto my-16"></p>
    )
  );
};

export default IntersectionObject;
