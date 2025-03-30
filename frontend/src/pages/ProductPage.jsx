import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { returnBaseProduct } from "../components/utilities/returnProduct";
import AdditionalProducts from "../components/additionalProducts";

const ProductPage = () => {
  const [productInfo, setProductInfo] = useState({});
  const { productName, productId, color, size } = useParams();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const nav = useNavigate();
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    const returnedProduct = await returnBaseProduct(productId, enableTest);
    setProduct(returnedProduct);
    setLoading(false);
  };
  useEffect(() => {
    fetchProduct();
  }, [JSON.stringify(productInfo)]);

  useEffect(() => {
    if (product) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const foundColor = product.colors.find((c) => color === c.idMod);
      setProductInfo({
        sku: productId,
        colorInfo: foundColor || product.colors[0],
        sizeInfo: size,
      });
    }
  }, [product, JSON.stringify(params)]);
  return (
    <>
      <Header></Header>
      <div className="w-full md:w-[95%] mx-auto *:h-fit overflow-x-hidden">
        {loading ||
        (productInfo &&
          product &&
          product.colors &&
          product.productName &&
          product.sku) ? (
          <ProductInfoContext.Provider value={{ productInfo, setProductInfo }}>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-2  md:w-full xl:w-4/5 m-auto h-fit overflow-visible">
              <ProductImage
                product={product}
                productColor={color}
                urlSize={size}
                loading={loading}
              />
              <ProductInfo
                product={product}
                productColor={color}
                urlSize={size}
                loading={loading}
              />
            </div>
          </ProductInfoContext.Provider>
        ) : (
          <h1 className="text-3xl mx-auto flex items-center justify-center py-20">
            Product Not Found
          </h1>
        )}{" "}
        <div className="md:gap-0 md:w-full mx-auto mt-6">
          {product ? (
            <AdditionalProducts
              tags={product.tags}
              ignoreSKUList={[product.sku]}
            />
          ) : !loading ? (
            <AdditionalProducts tags={[""]} ignoreSKUList={[]} />
          ) : null}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
