import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState, useRef } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import Filter from "../components/shopping-components/filter";
import IntersectionObject from "../components/shopping-components/intersectionObject";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

function Shopping({ categoryName, categoryId, tags, isSearch = false }) {
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [displayName, setDisplayName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sortingInfo, setSortingInfo] = useState({});
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { subsection } = useParams();

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
    fetchQuery.current = !isSearch ? tags || ["new"] : [searchParams.get("q")];
    if (
      (isSearch && searchParams.get("q") && fetchQuery.current) ||
      !isSearch
    ) {
      if (subsection) {
        fetchQuery.current = [...fetchQuery.current, subsection];
      }
      refetchProducts(fetchQuery.current, sortingInfo, enableTest, cursor);
      setLoading(true);
    }

    setSubtitle(subsection ? subsection : "");

    if (categoryName) {
      setDisplayName(categoryName);
    } else if (isSearch && searchParams.get("q")) {
      setDisplayName(
        searchParams
          .get("q")
          .split(" ")
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ")
      );
    } else {
      setDisplayName("New Arrivals");
    }
  }, [categoryName, categoryId, JSON.stringify(sortingInfo), searchParams]);

  useEffect(() => {
    if (!isLoading) setLoading(false);
  }, [isLoading]);

  return (
    <>
      <Header />
      <div className="w-full mx-auto bg-bgBase lg:pr-[2rem]">
        <div className="lg:px-4 px-8 text-3xl capitalize pt-2">
          {isSearch ? (
            <div className="flex flex-col w-fit">
              {" "}
              <p className="text-base">Search results for </p>
              <p className="text-3xl">
                {displayName} &nbsp;
                {/* ({(products && products.length) || 0}) */}
              </p>
            </div>
          ) : (
            displayName
          )}
        </div>
        <h2 className="capitalize lg:px-4 px-8 pb-2 lg:pb-4 text-xl text-textHollow/65">
          {subsection}
        </h2>
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
