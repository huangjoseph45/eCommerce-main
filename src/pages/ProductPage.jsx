import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useState } from "react";

const ProductPage = ({ product }) => {
  const [productInfo, setProductInfo] = useState({
    productId: product.id,
    colorInfo: product.colors[0],
    sizeInfo: null,
  });
  return (
    <>
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto *:h-fit overflow-x-hidden">
        <Header></Header>
        <ProductInfoContext.Provider value={{ productInfo, setProductInfo }}>
          <div className="flex flex-col lg:flex-row justify-center xl: gap-8  lg:w-full xl:w-4/5 2xl:w-3/4 m-auto">
            <ProductImage productId="test" product={product} />
            <ProductInfo productId="test" product={product} />
          </div>
        </ProductInfoContext.Provider>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
