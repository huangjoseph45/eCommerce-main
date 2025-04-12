import { useEffect } from "react";
import ArrayItem from "./arrayItem";

const ArrayGrid = ({
  arrayLabel,
  itemArray,
  setProduct,
  product,
  field,
  setFormData,
  formData,
}) => {
  const deleteFunc = (index) => {
    const arrayItem = formData[field][index];
    const newArray = [...formData[field]].filter((item) => item !== arrayItem);

    setFormData({ ...formData, [field]: newArray });
  };

  const onChange = (e, field, idx) => {
    const newArray = [...formData[field]]; // <-- clone the array
    newArray[idx] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <>
      <h2>{arrayLabel}:</h2>
      <ul className="grid grid-cols-2 lg:grid-cols-3 w-fit gap-2">
        {itemArray.map((item, index) => {
          return (
            <ArrayItem
              key={index}
              item={item}
              field={field}
              onChange={onChange}
              index={index}
              deleteFunc={deleteFunc}
            />
          );
        })}
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
