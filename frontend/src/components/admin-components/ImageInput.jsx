import { useState, useEffect } from "react";

const ImageInput = ({
  index,
  setShownImage,
  colorIndex,
  colorObj,
  product,
  newImages,
  setNewImages,
}) => {
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected(!!file); // true if file exists
    if (file) {
      setNewImages([
        ...newImages,
        { image: file, product: product.sku, color: colorObj.idMod },
      ]);
    }
  };

  return (
    <>
      {index >= (colorObj.numImages || 0) ? (
        <div
          className={`w-[8rem] lg:w-[8rem] p-1 ${
            !fileSelected ? "bg-errorTrue" : "bg-errorFalse"
          } text-textLight outline-bgBlack outline cursor-pointer`}
        >
          <label htmlFor={`file-input-${index}`} className="cursor-pointer">
            {!fileSelected ? <p>Input Image</p> : <p>File Selected</p>}
          </label>
          <input
            onChange={handleFileChange}
            className="hidden"
            name={`file-input-${index}`}
            type="file"
            id={`file-input-${index}`}
            accept="image/png, image/jpeg, image/webp"
          />
        </div>
      ) : (
        <div
          key={`color-image-${index}`}
          onClick={() => setShownImage(index)}
          className="w-[8rem] lg:w-[8rem] p-1 bg-bgTertiary text-textLight outline-bgBlack outline cursor-pointer"
        >
          Show Image {index}
        </div>
      )}
    </>
  );
};

export default ImageInput;
