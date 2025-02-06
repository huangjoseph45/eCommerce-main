import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/cardgrid";
import { useEffect } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";

function Shopping() {
  const { isLoading, products, refetchProducts } = useFetchProducts();

  useEffect(() => {
    refetchProducts("");
  }, []);
  return (
    <>
      <Header />
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto">
        <CardGrid isLoading={isLoading} products={products} />
      </div>
      <Footer></Footer>
    </>
  );
}

export default Shopping;
