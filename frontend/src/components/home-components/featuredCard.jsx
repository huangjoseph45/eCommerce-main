import { useEffect, useState } from "react";
import useFetchTopProducts from "../utilities/useFetchTopProducts";
import CardPlaceHolder from "../shopping-components/cardPlaceholder";
import { useNavigate } from "react-router-dom";

const FeaturedCard = ({ tagArray }) => {
  const enableTest = import.meta.env.VITE_ENABLE_TEST === "1";
  const nav = useNavigate();
  const [loading, products, getProducts] = useFetchTopProducts();
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    getProducts({
      enableTest: enableTest,
      tagArray: tagArray,
      numProductsPerTag: 1,
    });
  }, []);

  useEffect(() => {
    console.log(products);
    if (products && products.length > 0) {
      console.log(products[0].colors);
      setImgSrc(
        `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
          products[0]?.sku + "-" + products[0]?.colors[0]?.idMod
        }`
      );
    }
  }, [products]);

  useEffect(() => {
    console.log(imgSrc);
  }, [imgSrc]);

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={() =>
        nav(
          "/" + products && products[0]
            ? (
                "p/" +
                encodeURIComponent(products[0].productName.replace(/ /g, "-")) +
                "/" +
                products[0].sku +
                "/" +
                products[0].colors[0]?.idMod +
                "/" +
                products[0].sizes[0]
              ).toLowerCase()
            : null
        )
      }
    >
      <h1 className="capitalize p-2 text-3xl">{tagArray[0]}</h1>
      {products ? (
        <>
          <div className="relative w-screen h-screen sm:h-[48rem] sm:w-[32rem] lg:h-[36rem] lg:w-[24rem]flex-shrink-0 rounded-sm snap-center overflow-hidden  hover:shadow-lg transition-all duration-200 ">
            <div className="relative h-full w-full">
              <img
                src={imgSrc ? imgSrc : null}
                alt=""
                className="object-top object-cover w-full h-full"
              />
              <span className="absolute top-0  left-0 bg-bgBlack/15 w-full h-full"></span>
            </div>
            <p className="absolute text-center py-4  bottom-8 left-1/2 -translate-x-1/2 text-3xl w-2/3 text-bgBase">
              {products[0].productName}
            </p>
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
