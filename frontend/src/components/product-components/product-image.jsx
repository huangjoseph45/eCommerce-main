import { useContext, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";

const ProductImage = ({ product, productColor = null, loading = false }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (product && productInfo) {
      try {
        const src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          product.sku + "-" + productColor
        }`;
        setImgSrc(src);
      } catch (error) {
        console.error("Error constructing image URL:", error);
        setImgSrc(null);
      }
    }
  }, [product, productInfo]);

  useEffect(() => {
    console.log(imgSrc);
  }, [imgSrc]);

  return (
    <>
      <div className="w-full max-w-[35rem] mx-auto">
        {loading && !imgSrc ? (
          <div className="object-cover rounded-b-md w-fit h-full object-top mx-auto aspect-[3/4] animate-pulseBg opacity-40"></div>
        ) : (
          <img
            src={imgSrc}
            alt={product?.sku || "Product Image"}
            loading="lazy"
            className="object-cover rounded-b-md w-fit h-fit max-h-full object-top mx-auto aspect-[3/4]"
          />
        )}
      </div>
    </>
  );
};

export default ProductImage;
