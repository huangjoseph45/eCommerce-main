import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/cardgrid";
import { useEffect } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const { isLoading, products, refetchProducts } = useFetchProducts();

  useEffect(() => {
    if (searchParams.size < 1) {
      nav("/");
    }
  }, [searchParams]);

  const searchQuery = searchParams.get("q");

  useEffect(() => {
    refetchProducts(searchQuery);
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
                {searchQuery}&nbsp;({products.length})
              </p>
            </div>

            <CardGrid isLoading={isLoading} products={products} />
          </>
        ) : (
          <div className="flex justify-center">
            <p className="text-3xl w-fit py-8">No Results Found for</p>
            <p className="text-3xl w-fit py-8">
              &nbsp;&quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}

export default SearchResultsPage;
