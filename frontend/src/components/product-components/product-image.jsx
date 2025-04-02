import { useContext, useState, useEffect } from "react";
import { ProductInfoContext } from "../utilities/ContextManager";
import { motion } from "motion/react";

const ProductImage = ({ product, productColor = null, loading = false }) => {
  const { productInfo } = useContext(ProductInfoContext);
  const [imgSrc, setImgSrc] = useState(null);
  const [numImages, setNumImages] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product && productInfo) {
      try {
        const src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          product.sku + "-" + productColor
        }`;
        setImgSrc(src);
        const numImg =
          product.colors.find((color) => color.idMod === productColor)
            .numImages || 0;
        setNumImages(numImg);
      } catch (error) {
        console.error("Error constructing image URL:", error);
        setImgSrc(null);
      }
    }
  }, [product, productInfo]);

  return (
    <div
      className={` mx-auto lg:mx-0 flex flex-col-reverse lg:flex-row w-full md:w-[55%] lg:w-full justify-center items-center ${
        numImages > 0 ? "xl:w-[55%]" : "xl:w-fit"
      } gap-2 lg:gap-4  mx-auto`}
    >
      {product && product.colors && numImages ? (
        <ul className="h-32 snap-x snap-mandatory w-full  sm:w-full  lg:h-full lg:w-32 flex-shrink-0 flex flex-row items-start lg:flex-col overflow-scroll scrollbar-hide">
          {Array(numImages)
            .fill(0)
            .map((num, index) => {
              let src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                product.sku + "-" + productColor
              }`;
              if (index > 0) {
                src = `${src}-${index}`;
              }
              return (
                <motion.div
                  key={src}
                  onHoverStart={() => setSelectedImage(src)}
                  onHoverEnd={() => setSelectedImage(null)}
                  onClick={() => {
                    setImgSrc(src);
                  }}
                  className={`snap-center flex-shrink-0 w-28 h-28  lg:h-32 lg:w-32 cursor-pointer content-border rounded-sm ${
                    index !== 0 && index !== numImages - 1 ? "p-1" : "py-1"
                  } ${index == 0 ? "pr-1" : index == numImages - 1 && "pl-1"}`}
                >
                  <img
                    src={src}
                    alt=""
                    className={`w-full h-full aspect-square object-cover  border-bgSecondary  rounded-sm ${
                      imgSrc === src ? "border-2" : "hover:border"
                    }`}
                  />
                </motion.div>
              );
            })}
        </ul>
      ) : null}
      <div className="w-full">
        {loading && !imgSrc ? (
          <div className="object-cover rounded-b-md h-full object-top mx-auto animate-pulseBg opacity-40"></div>
        ) : (
          <img
            src={selectedImage ? selectedImage : imgSrc}
            alt={product?.sku || "Product Image"}
            loading="lazy"
            className="object-cover rounded-b-md h-full max-h-full object-top w-full aspect-[3/4]"
          />
        )}
      </div>
    </div>
  );
};

export default ProductImage;
