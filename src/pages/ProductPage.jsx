import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useEffect, useState } from "react";
import useFetchProducts from "../components/utilities/useFetchMultipleProducts";

const ProductPage = ({ product }) => {
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    setProductInfo({
      sku: product.sku,
      colorInfo: product.colors[0],
      sizeInfo: null,
    });
  }, []);

  return (
    <>
      {" "}
      <Header></Header>
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto *:h-fit overflow-x-hidden">
        <ProductInfoContext.Provider value={{ productInfo, setProductInfo }}>
          <div className="flex flex-col lg:flex-row justify-center xl: gap-8  lg:w-full xl:w-4/5 2xl:w-3/4 m-auto">
            <ProductImage product={product} />
            <ProductInfo product={product} />
          </div>
        </ProductInfoContext.Provider>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
