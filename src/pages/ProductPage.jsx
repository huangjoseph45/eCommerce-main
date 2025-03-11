import "../index.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductImage from "../components/product-components/product-image";
import ProductInfo from "../components/product-components/product-info";
import { ProductInfoContext } from "../components/utilities/ContextManager";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { returnBaseProduct } from "../components/utilities/returnProduct";

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
    if (!color && productInfo?.colorInfo) {
      nav(`/p/${productName}/${productId}/${productInfo.colorInfo.idMod}`);
    }
  }, [JSON.stringify(productInfo)]);

  useEffect(() => {
    if (product) {
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
      {" "}
      <Header></Header>
      <div className="w-full md:w-[95%] mx-auto *:h-fit overflow-x-hidden">
        {loading ||
        (productInfo &&
          product &&
          product.colors &&
          product.productName &&
          product.sku) ? (
          <ProductInfoContext.Provider value={{ productInfo, setProductInfo }}>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0  md:w-full xl:w-4/5 m-auto h-fit min-h-[40rem] overflow-visible">
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
        )}
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
