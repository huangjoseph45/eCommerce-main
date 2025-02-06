import { useContext, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";

const ProductImage = ({ product }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (product && productInfo) {
      try {
        const src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          product.sku + "-" + productInfo.colorInfo.idMod
        }`;
        console.log(src);
        setImgSrc(src);
      } catch (error) {
        console.error("Error constructing image URL:", error);
        setImgSrc(null);
      }
    }
  }, [product, productInfo]);

  return (
    <>
      <div className="w-full h-[35rem] xs:h-[40rem] lg:w-[40rem] lg:h-[40rem] 2xl:w-[55rem] 2xl:h-[65rem]">
        <img
          src={imgSrc}
          alt={product?.id || "Product Image"}
          loading="lazy"
          className="object-contain w-fit h-fit max-h-full object-top lg:rounded-lg border mx-auto"
        />
      </div>
    </>
  );
};

export default ProductImage;
