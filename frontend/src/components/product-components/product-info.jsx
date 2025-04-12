import parsePrice from "../utilities/parsePrice";
import { useState, useEffect, useContext, useRef } from "react";
import AddToCart from "./add-to-cart-button";
import SizesDropdown from "./size-dropdown";
import { ProductInfoContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";
import SquigglyText from "../cart-components/squigglyText";

const ProductInfo = ({
  product,
  productColor = null,
  loading = false,
  urlSize,
}) => {
  const nav = useNavigate();
  const { setProductInfo } = useContext(ProductInfoContext);
  const [highlightSize, setHighlightSize] = useState(false);
  const { initialPrice, finalPrice } = parsePrice(
    product?.price,
    product?.discount
  );
  const sizeRef = useRef();

  useEffect(() => {
    const newColorInfo = product?.colors.find(
      (colorL) => colorL.idMod === productColor
    );
    if (newColorInfo) {
      setProductInfo((prevInfo) => ({
        ...prevInfo,
        colorInfo: newColorInfo,
      }));
    }
  }, [product?.colors, productColor]);

  const scrollToSize = () => {
    sizeRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    setHighlightSize(true);
  };

  const colorBoxes = product?.colors.map((color) => (
    <div
      key={color.colorCode}
      className={`w-12 h-12 lg:w-8 lg:h-8 border hover:border-blue-400 hover:border-2 cursor-pointer  hover:scale-[110%] transition-all shadow-md duration-150 rounded-full ${
        productColor &&
        productColor === color.idMod &&
        "border-blue-500 border-[.15rem] "
      }`}
      style={{ backgroundColor: color.colorCode }}
      onClick={() =>
        nav(
          `/p/${product?.productName}/${product?.sku}/${color && color.idMod}${
            urlSize ? `/${urlSize}` : ""
          }`
        )
      }
    ></div>
  ));

  return (
    <div className="px-4 mx-auto flex flex-col justify-start xl:h-fit w-full lg:w-1/2 md:w-[40%] relative ">
      <h1 className="text-3xl font-semibold ">
        {loading && !product ? (
          <div className="h-[2rem]">
            <SquigglyText />{" "}
          </div>
        ) : (
          product?.productName
        )}
      </h1>
      {loading && !product ? (
        <div className="text-base text-slate-500 pb-3  w-fit h-[2rem]">
          <SquigglyText />
        </div>
      ) : (
        product?.type
      )}
      <div className="pb-4 w-full">
        {loading && !product ? (
          <div className="h-[3rem] w-12">
            <SquigglyText />
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl">${finalPrice}</p>
              {product?.discount !== 0 && (
                <p className="text-md line-through text-gray-500">
                  ${initialPrice}
                </p>
              )}
            </div>
            {product?.discount !== 0 && (
              <p className="font-semibold text-base text-bgTertiary">
                {product?.discount}% off
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col pb-4 gap-1">
        {loading && !product ? (
          <>
            <div className="w-24 h-[3rem]">
              <SquigglyText />
            </div>
            <div className="h-[2rem] w-4/5">
              {" "}
              <SquigglyText />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row gap-1 capitalize">
              <p>Color:</p>
              <p>
                {
                  product?.colors?.find((color) => color.idMod === productColor)
                    ?.colorName
                }
              </p>
            </div>
            <div className="flex flex-row gap-6 lg:gap-4">{colorBoxes}</div>
          </>
        )}
      </div>
      {loading && !product ? (
        <>
          {" "}
          <div className="w-[4rem] h-[1.5rem] mb-2">
            <SquigglyText />
          </div>
          <div className="w-[6rem] h-[3rem] mb-2">
            <SquigglyText />
          </div>
        </>
      ) : (
        <div ref={sizeRef}>
          <SizesDropdown
            product={product}
            urlSize={urlSize}
            highlightSize={highlightSize}
            setHighlightSize={setHighlightSize}
          />
        </div>
      )}
      {loading && !product ? (
        <>
          <div className="w-full h-[3rem] mb-8">
            <SquigglyText />
          </div>{" "}
          <div className="w-full h-[5rem]">
            {" "}
            <SquigglyText />
          </div>
        </>
      ) : (
        <>
          <AddToCart product={product} scrollToSize={scrollToSize} />
          <p className="mt-8 w-[90%] mb-12">{product?.description}</p>
        </>
      )}
    </div>
  );
};

export default ProductInfo;
