const ArrayGrid = ({ arrayLabel, itemArray, setProduct, product, setter }) => {
  return (
    <>
      <h2>{arrayLabel}:</h2>
      <ul className="grid grid-cols-2 lg:grid-cols-3 w-fit gap-2">
        {itemArray.map((item, index) => (
          <input
            type="text"
            defaultValue={item}
            key={item + index}
            className="w-[12rem] p-1 bg-bgBase2 outline"
          />
        ))}
        <button
          className="w-[12rem] bg-bgExtraSecondaryLight hover:bg-bgExtraSecondaryLight/80 text-textLight p-2"
          onClick={() => {
            setProduct({
              ...product,
              [setter]: [...product[setter], ""],
            });
          }}
        >
          +
        </button>
      </ul>
    </>
  );
};

export default ArrayGrid;
