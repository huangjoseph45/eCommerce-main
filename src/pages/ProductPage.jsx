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

  const fetchProduct = async () => {
    const returnedProduct = await returnBaseProduct(productId);
    setProduct(returnedProduct);
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
        {productInfo &&
          product &&
          product.colors &&
          product.productName &&
          product.sku && (
            <ProductInfoContext.Provider
              value={{ productInfo, setProductInfo }}
            >
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0  md:w-full xl:w-4/5 m-auto">
                <ProductImage
                  product={product}
                  pageColor={color}
                  urlSize={size}
                />
                <ProductInfo
                  product={product}
                  pageColor={color}
                  urlSize={size}
                />
              </div>
            </ProductInfoContext.Provider>
          )}
      </div>
      <Footer></Footer>
    </>
  );
};
export default ProductPage;
