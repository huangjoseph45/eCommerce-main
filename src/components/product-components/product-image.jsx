import { useContext, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ProductContext";

const ProductImage = ({ product }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (product && productInfo) {
      try {
        const src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          product.id + "-" + productInfo.colorInfo.idMod
        }`;
        setImgSrc(src);
      } catch (error) {
        console.error("Error constructing image URL:", error);
        setImgSrc(null);
      }
    }
  }, [product, productInfo]);

  return (
    <>
      <div className="w-full h-[40rem] lg:w-[40rem] lg:h-[40rem] 2xl:w-[55rem] 2xl:h-[65rem]">
        <img
          src={imgSrc}
          alt={product?.id || "Product Image"}
          loading="lazy"
          className="object-contain w-full h-full object-top"
        />
      </div>
    </>
  );
};

export default ProductImage;
