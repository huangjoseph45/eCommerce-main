import ColorRow from "./ColorRow";

const ColorGrid = ({ product, setProduct, newImages, setNewImages }) => {
  return (
    <>
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
                  <div key={color.idMod + index}>
                    <ColorRow
                      colorObj={color}
                      product={product}
                      setProduct={setProduct}
                      newImages={newImages}
                      setNewImages={setNewImages}
                    />
                  </div>
                );
              })
          : null}
        <button
          className="mt-4 w-[8rem] lg:w-[8rem] bg-bgExtraSecondaryLight hover:bg-bgExtraSecondaryLight/80 text-textLight p-2"
          onClick={() => {
            setProduct({
              ...product,
              colors: [
                ...product.colors,
                { colorName: "", colorCode: "#", idMod: "" },
              ],
            });
          }}
        >
          +
        </button>
      </ul>
    </>
  );
};

export default ColorGrid;
