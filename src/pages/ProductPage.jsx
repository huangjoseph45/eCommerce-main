import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useEffect, useState } from "react";

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
      <div className="w-full md:w-[95%] mx-auto *:h-fit overflow-x-hidden">
        <ProductInfoContext.Provider value={{ productInfo, setProductInfo }}>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0  md:w-full xl:w-4/5 m-auto">
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
