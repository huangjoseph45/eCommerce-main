import { useEffect, useState, useRef } from "react";
import useFetchTopProducts from "../utilities/useFetchTopProducts";
import CardPlaceHolder from "../shopping-components/cardPlaceholder";
import { useNavigate } from "react-router-dom";

const FeaturedCard = ({ section, index }) => {
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const nav = useNavigate();
  const [loading, products, getProducts] = useFetchTopProducts();
  const [imgSrc, setImgSrc] = useState(null);
  const middleElement = useRef(null);

  useEffect(() => {
    if (section) {
      getProducts({
        enableTest: enableTest,
        tagArray: section.tags,
        numProductsPerTag: 1,
      });
    }
  }, [section]);

  useEffect(() => {
    if (index === 1 && middleElement.current) {
      middleElement.current.scrollIntoView({
        inline: "center",
      });
      window.scrollTo(0, 0);
    }
  }, [middleElement.current]);

  useEffect(() => {
    if (products && products.length > 0) {
      console.log(products[0].colors);
      setImgSrc(
        `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          products[0]?.sku + "-" + products[0]?.colors[0]?.idMod
        }`
      );
    }
  }, [products]);

  return (
    <div
      ref={middleElement}
      className="flex flex-col cursor-pointer"
      onClick={() => nav("/" + section.slug)}
    >
      {products ? (
        <>
          <div className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden  hover:shadow-lg transition-all duration-200 ">
            <h1 className="absolute z-20 text-textLight capitalize p-2 text-4xl bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {section.sectionTitle}
            </h1>
            <div className="relative h-full w-full">
              <img
                src={imgSrc ? imgSrc : null}
                alt=""
                className="object-top object-cover w-full h-full"
              />
              <span className="absolute top-0  left-0 bg-[#362709]/15 w-full h-full"></span>
            </div>
          </div>
        </>
      ) : !loading ? null : (
        <div className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden">
          <CardPlaceHolder showText={false} />{" "}
        </div>
      )}
    </div>
  );
};

export default FeaturedCard;
