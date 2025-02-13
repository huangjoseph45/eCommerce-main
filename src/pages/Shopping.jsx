import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/shopping-components/cardgrid";
import { useEffect, useState } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";

function Shopping({ categoryName, categoryId }) {
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchQuery = categoryId ? categoryId : "new";
    refetchProducts(fetchQuery);
    setDisplayName(categoryName ? categoryName : "New Arrivals");
  }, [categoryName, categoryId]);
  return (
    <>
      <Header />
      <div className="w-full mx-auto bg-bgBase lg:px-[4rem]">
        <div className="px-8 text-3xl py-8">{displayName}</div>
        <CardGrid isLoading={isLoading} products={products} />
      </div>
      <Footer></Footer>
    </>
  );
}

export default Shopping;
