const ArrayGrid = ({
  arrayLabel,
  itemArray,
  setProduct,
  product,
  field,
  setFormData,
  formData,
}) => {
  const onChange = (e, field, idx) => {
    const newArray = [...formData[field]]; // <-- clone the array
    newArray[idx] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <>
      <h2>{arrayLabel}:</h2>
      <ul className="grid grid-cols-2 lg:grid-cols-3 w-fit gap-2">
        {itemArray.map((item, index) => (
          <input
            type="text"
            defaultValue={item}
            key={index}
            className="w-[12rem] p-1 bg-bgBase2 outline"
            onChange={(e) => onChange(e, field, index)}
          />
        ))}
        <button
          className="w-[12rem] bg-bgExtraSecondaryLight hover:bg-bgExtraSecondaryLight/80 text-textLight p-2"
          onClick={() => {
            setProduct({
              ...product,
              [field]: [...product[field], ""],
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
