import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState, useRef } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import Filter from "../components/shopping-components/filter";
import IntersectionObject from "../components/shopping-components/intersectionObject";

function Shopping({ categoryName, categoryId, searchQuery }) {
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [displayName, setDisplayName] = useState("");
  const [sortingInfo, setSortingInfo] = useState({});
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const fetchQuery = useRef();

  useEffect(() => {
    setCursor(0);
    window.scroll(0, 0);
  }, [sortingInfo]);

  useEffect(() => {
    if (cursor === 0) return;
    refetchProducts(fetchQuery.current, sortingInfo, enableTest, cursor);
  }, [cursor]);

  useEffect(() => {
    fetchQuery.current = searchQuery || ["new"];
    refetchProducts(fetchQuery.current, sortingInfo, enableTest, cursor);
    setLoading(true);

    if (categoryName) {
      setDisplayName(categoryName);
    } else {
      setDisplayName("New Arrivals");
    }
  }, [categoryName, categoryId, JSON.stringify(sortingInfo)]);

  useEffect(() => {
    if (!isLoading) setLoading(false);
  }, [isLoading]);

  return (
    <>
      <Header />
      <div className="w-full mx-auto bg-bgBase lg:pr-[2rem]">
        <div className="lg:px-4 px-8 text-3xl py-8 capitalize">
          {displayName}
        </div>
        <div className="flex lg:flex-row flex-col">
          <div className="px-8 lg:pl-4  w-fit relative mb-2">
            <Filter sortingInfo={sortingInfo} setSortingInfo={setSortingInfo} />
          </div>
          <div className="flex flex-col w-full">
            <CardGrid isLoading={loading} products={products} />
          </div>
        </div>
      </div>
      {products && !loading && (
        <IntersectionObject
          products={products}
          loading={isLoading}
          setCursor={setCursor}
          sortingInfo={sortingInfo}
          cursor={cursor}
          fetchQuery={fetchQuery.current}
        />
      )}

      <Footer></Footer>
    </>
  );
}

export default Shopping;
