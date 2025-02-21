import parsePrice from "../utilities/parsePrice";
import { useState, useEffect, useContext } from "react";
import AddToCart from "./add-to-cart-button";
import SizesDropdown from "./size-dropdown";
import { ProductInfoContext } from "../utilities/ContextManager";

const ProductInfo = ({ product }) => {
  const { setProductInfo } = useContext(ProductInfoContext);
  const { initialPrice, finalPrice } = parsePrice(
    product.price,
    product.discount
  );
  const [currentColor, setCurrentColor] = useState(product.colors[0].colorName);

  useEffect(() => {
    const newColorInfo = product.colors.find(
      (color) => color.colorName.localeCompare(currentColor) === 0
    );
    if (newColorInfo && newColorInfo !== currentColor) {
      setCurrentColor(newColorInfo.colorName);
      setProductInfo((prevInfo) => ({
        ...prevInfo,
        colorInfo: newColorInfo,
      }));
    }
  }, [currentColor, product.colors]);

  const colorBoxes = product.colors.map((color) => (
    <div
      key={color.colorCode}
      className={`w-12 h-12 lg:w-8 lg:h-8 border hover:border-blue-400 hover:border-2 cursor-pointer  hover:scale-[110%] transition-all shadow-md duration-150 rounded-full ${
        currentColor.localeCompare(color.colorName) === 0 &&
        "border-blue-500 border-[.15rem] "
      }`}
      style={{ backgroundColor: color.colorCode }}
      onClick={() => setCurrentColor(color.colorName)}
    ></div>
  ));

  return (
    <div className="mx-8 flex flex-col justify-start xl:h-fit w-full xl:w-1/2">
      <h1 className="text-3xl font-semibold">{product.productName}</h1>
      <p className="text-base text-slate-500 pb-3">{product.type}</p>
      <div className="pb-4">
        <div className="flex flex-row items-center gap-2">
          <p className="text-xl">${finalPrice}</p>
          {product.discount !== 0 && (
            <p className="text-md line-through text-gray-500">
              ${initialPrice}
            </p>
          )}
        </div>
        {product.discount !== 0 && (
          <p className="font-semibold text-base text-green-600">
            {product.discount}% off
          </p>
        )}
      </div>
      <div className="flex flex-col pb-4 gap-1">
        <div className="flex flex-row gap-1 capitalize">
          <p>Color:</p>
          <p>{currentColor}</p>
        </div>
        <div className="flex flex-row gap-6 lg:gap-4">{colorBoxes}</div>
      </div>
      <SizesDropdown product={product} />
      <AddToCart product={product} />
      <p className="w-[90%]">{product.description}</p>
    </div>
  );
};

export default ProductInfo;
