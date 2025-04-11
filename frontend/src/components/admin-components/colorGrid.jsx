import ColorRow from "./colorRow";

const ColorGrid = ({ product, setProduct, imageCreationState }) => {
  return (
    <div className="my-4 relative w-fit">
      <div
        className={
          imageCreationState
            ? "absolute w-full outline outline-8 outline-bgBlack/15 h-full bg-bgBlack/15"
            : "hidden"
        }
      ></div>
      <h2>Colors:</h2>
      <ul className="flex flex-col lg:grid-cols-3 w-fit">
        <div className="flex flex-rowborder">
          <p className="w-[8rem] lg:w-[8rem] p-1 text-center">Color Name</p>
          <p className="w-[8rem] lg:w-[8rem] p-1 text-center">Hex Code</p>
          <p className="w-[8rem] lg:w-[8rem] p-1 text-center">Color Id</p>
        </div>
        {product?.colors
          ? product.colors
              .sort((a, b) => a.colorName > b.colorName)
              .map((color, index) => {
                return (
                  <div key={index}>
                    <ColorRow
                      colorObj={color}
                      product={product}
                      setProduct={setProduct}
                      index={index}
                      imageCreationState={imageCreationState}
                    />
                  </div>
                );
              })
          : null}
        <button
          className="mt-4 w-[8rem] lg:w-[8rem] bg-bgExtraSecondaryLight hover:bg-bgExtraSecondaryLight/80 text-textLight p-2"
          onClick={() => {
            if (!imageCreationState)
              setProduct({
                ...product,
                colors: [
                  ...product.colors,
                  { colorName: "", colorCode: "#", idMod: "", numImages: 0 },
                ],
              });
          }}
        >
          +
        </button>
      </ul>
    </div>
  );
};

export default ColorGrid;
