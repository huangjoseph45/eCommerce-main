import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ImageInput from "./ImageInput";

const ColorRow = ({
  colorObj,
  product,
  setProduct,
  newImages,
  setNewImages,
}) => {
  const [showImagesGrid, setShowImagesGrid] = useState(false);
  const [shownImage, setShownImage] = useState(null);
  const [optimisticImages, setOptimisticImages] = useState(0);

  const colorIndex =
    product?.colors?.find((color) => color.idMod === colorObj.idMod)
      ?.numImages || 0;

  useEffect(() => {
    setOptimisticImages(colorObj?.numImages || 0);
  }, [product, colorObj]);

  return (
    <>
      <div className="flex flex-row">
        <input
          type="text"
          defaultValue={colorObj.colorName}
          className="w-[8rem] lg:w-[8rem] p-1 bg-bgBase2 outline"
        />
        <input
          type="text"
          defaultValue={colorObj.colorCode}
          maxLength={7}
          className="w-[8rem] lg:w-[8rem] p-1 bg-bgBase2 outline"
        />{" "}
        <input
          type="text"
          defaultValue={colorObj.idMod}
          className="w-[8rem] lg:w-[8rem] p-1 bg-bgBase2 outline"
          maxLength={3}
        />
        <button
          onClick={() => setShowImagesGrid(!showImagesGrid)}
          className="w-[8rem] lg:w-[8rem] p-1 bg-bgBase outline flex items-center justify-center gap-1"
        >
          <p className="rotate-180">&#x5e;</p>
          Images
        </button>
      </div>
      {showImagesGrid && (
        <ul className="grid grid-cols-4">
          {Array.from({
            length: optimisticImages,
          }).map((_, index) => (
            <ImageInput
              key={"color-image-" + index}
              index={index}
              setShownImage={setShownImage}
              colorIndex={colorIndex}
              product={product}
              colorObj={colorObj}
              newImages={newImages}
              setNewImages={setNewImages}
            />
          ))}
          <div
            className="w-[8rem] lg:w-[8rem] p-1 bg-bgExtraSecondaryLight text-textLight outline-bgBlack outline cursor-pointer flex items-center justify-center"
            onClick={() => {
              setOptimisticImages(optimisticImages + 1);
            }}
          >
            +
          </div>
        </ul>
      )}
      {shownImage !== null &&
        createPortal(
          <>
            <div
              className="w-screen h-screen top-0 left-0 fixed"
              onClick={() => setShownImage(null)}
            ></div>
            <div className="fixed w-[40rem] h-[40rem] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer">
              <img
                src={`https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                  product.sku
                }-${colorObj.idMod}${shownImage !== 0 ? `-${shownImage}` : ""}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </>,
          document.body
        )}
    </>
  );
};

export default ColorRow;
