import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState, useRef } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Filter from "../components/shopping-components/filter";

function SearchResultsPage() {
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [searchQuery, setSearchQuery] = useState();
  const displayQuery = useRef();
  const [sortingInfo, setSortingInfo] = useState({});

  useEffect(() => {
    if (searchParams.size < 1) {
      nav("/");
    } else {
      setSearchQuery(searchParams.get("q"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery) {
      refetchProducts(searchQuery, sortingInfo, enableTest);
      displayQuery.current = searchQuery
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
  }, [searchQuery, sortingInfo]);

  return (
    <>
      <Header />
      <div className="w-full px-4">
        <>
          <div className="flex flex-col my-4 w-fit px-4">
            {" "}
            <p className="text-base">Search results for </p>
            <p className="text-3xl">
              {displayQuery.current}&nbsp;({(products && products.length) || 0})
            </p>
          </div>
          <div className="flex lg:flex-row flex-col">
            <div className="px-8 lg:pl-4  w-fit relative mb-2">
              <Filter
                sortingInfo={sortingInfo}
                setSortingInfo={setSortingInfo}
              />
            </div>
            {products && products.length > 0 ? (
              <CardGrid isLoading={isLoading} products={products} />
            ) : (
              <div className="flex justify-center w-full">
                <p className="text-3xl w-fit py-8 mx-2">
                  <p className="capitalize">
                    No Results Found for&nbsp;&quot;{searchQuery}&quot;
                  </p>
                </p>
              </div>
            )}
          </div>
        </>
      </div>
      <Footer></Footer>
    </>
  );
}

export default SearchResultsPage;

{
  /* <div className="w-full mx-auto bg-bgBase lg:pr-[2rem]">
        <div className="lg:px-4 px-8 text-3xl py-8 capitalize">
          {displayName}
        </div>
        <div className="flex lg:flex-row flex-col">
          <div className="px-8 lg:pl-4  w-fit relative mb-2">
            <Filter sortingInfo={sortingInfo} setSortingInfo={setSortingInfo} />
          </div>
          <div className="flex flex-col">
            <CardGrid
              loadingBuffer={loadingBuffer}
              isLoading={isLoading}
              products={products}
            />
          </div>
        </div>
      </div>
      <Footer></Footer> */
}
