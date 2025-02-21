import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnBaseProduct } from "../components/utilities/returnProduct";

const ProductPage = () => {
  const [productInfo, setProductInfo] = useState({});
  const { productName, productId } = useParams();
  const params = useParams();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    console.log(params);
    const returnedProduct = await returnBaseProduct(productId);
    console.log(returnedProduct);
    setProduct(returnedProduct);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product) {
      console.log(product);
      setProductInfo({
        sku: productId,
        colorInfo: product.colors[0],
        sizeInfo: null,
      });
    }
  }, [product]);

  return (
    <>
      {" "}
      <Header></Header>
      <div className="w-full md:w-[95%] mx-auto *:h-fit overflow-x-hidden">
        {productInfo &&
          product &&
          product.colors &&
          product.productName &&
          product.sku && (
            <ProductInfoContext.Provider
              value={{ productInfo, setProductInfo }}
            >
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0  md:w-full xl:w-4/5 m-auto">
                <ProductImage product={product} />
                <ProductInfo product={product} />
              </div>
            </ProductInfoContext.Provider>
          )}
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
