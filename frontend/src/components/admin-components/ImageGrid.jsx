import { useState, useEffect } from "react";
import ImageInput from "./ImageInput";

const ImageGrid = ({
  colors,
  formData,
  setFormData,
  fileArray,
  setFileArray,
  sku,
}) => {
  const [tempColors, setTempColors] = useState();
  useEffect(() => {
    setTempColors(colors);
  }, [colors]);

  console.log(fileArray);

  return (
    <ul className="grid grid-cols-4 w-fit gap-4">
      {tempColors &&
        tempColors.map((color, index) => {
          return (
            <ul
              className="w-[12rem] items-center gap-2 flex flex-col "
              key={color.idMod}
            >
              <h2 className="text-center">{color.idMod}</h2>
              <ul className="w-full gap-2">
                {Array(color.numImages)
                  .fill(0)
                  .map((val, i) => {
                    const src = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${sku}-${
                      color.idMod
                    }${i !== 0 ? `-${i}` : ""}`;

                    return i < colors[index]?.numImages ? (
                      <li
                        key={i}
                        className="mb-2 w-full outline p-2 bg-bgTertiary"
                      >
                        <img
                          src={src}
                          alt=""
                          className="object-contain mx-auto"
                        />
                      </li>
                    ) : (
                      <ImageInput
                        fileArray={fileArray}
                        setFileArray={setFileArray}
                        color={color}
                        key={i}
                        index={i}
                      />
                    );
                  })}
              </ul>

              <button
                className="cursor-pointer w-full p-2 text-center bg-bgExtraSecondaryLight text-textLight outline outline-bgExtraSecondaryLight border border-bgExtraSecondaryLight"
                onClick={() => {
                  const c = [...tempColors]; // shallow copy
                  c[index] = { ...c[index], numImages: c[index].numImages + 1 };
                  setTempColors(c);
                }}
              >
                +
              </button>
            </ul>
          );
        })}
    </ul>
  );
};

export default ImageGrid;
