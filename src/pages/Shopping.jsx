import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";
import Filter from "../components/shopping-components/filter";

function Shopping({ categoryName, categoryId, searchQuery }) {
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [displayName, setDisplayName] = useState("");
  const [sortingInfo, setSortingInfo] = useState({});
  const [loadingBuffer, setLoadingBuffer] = useState(true);

  useEffect(() => {
    const bufferId = setTimeout(() => {
      setLoadingBuffer(false);
    }, 125);

    return () => clearTimeout(bufferId);
  });

  useEffect(() => {
    console.log(sortingInfo);
    const fetchQuery = searchQuery || "new";
    refetchProducts(fetchQuery[0], sortingInfo);

    if (categoryName) {
      setDisplayName(categoryName);
    } else {
      setDisplayName("New Arrivals");
    }
  }, [categoryName, categoryId, JSON.stringify(sortingInfo)]);

  return (
    <>
      <Header />

      <div className="w-full mx-auto bg-bgBase lg:px-[4rem]">
        <div className="px-8 text-3xl py-8 capitalize">{displayName}</div>
        <div className="flex flex-row">
          <div className="px-8">
            <Filter sortingInfo={sortingInfo} setSortingInfo={setSortingInfo} />
          </div>
        </div>
        <CardGrid
          loadingBuffer={loadingBuffer}
          isLoading={isLoading}
          products={products}
        />
      </div>
      <Footer></Footer>
    </>
  );
}

export default Shopping;
