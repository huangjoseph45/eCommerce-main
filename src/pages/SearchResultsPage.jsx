import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState, useRef } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const { isLoading, products, refetchProducts } = useFetchProducts();
  const [searchQuery, setSearchQuery] = useState();
  const displayQuery = useRef();

  useEffect(() => {
    if (searchParams.size < 1) {
      nav("/");
    } else {
      setSearchQuery(searchParams.get("q"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      searchQuery &&
      searchQuery.toLowerCase() !== "namkhang has a small pp"
    ) {
      refetchProducts(searchQuery);
      displayQuery.current = searchQuery
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
  }, [searchQuery]);

  return (
    <>
      <Header />
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto px-8 lg:px-4">
        {products && products.length > 0 ? (
          <>
            <div className="flex flex-col my-4 w-fit">
              {" "}
              <p className="text-base">Search results for </p>
              <p className="text-3xl">
                {displayQuery.current}&nbsp;({products.length})
              </p>
            </div>

            <CardGrid isLoading={isLoading} products={products} />
          </>
        ) : (
          <div className="flex justify-center">
            <p className="text-3xl w-fit py-8 mx-2">
              {searchQuery &&
              searchQuery.toLowerCase() === "namkhang has a small pp" ? (
                <div className="flex flex-col items-center justify-center lowercase">
                  <p>namkhang has a small pp?</p>
                  <p>He does</p>
                </div>
              ) : (
                "No Results Found for&nbsp;&quot;{searchQuery}&quot;"
              )}
            </p>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}

export default SearchResultsPage;
