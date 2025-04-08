const SingleInput = ({
  label,
  product,
  field,
  changeFunc,
  isNumber = false,
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label htmlFor="productName">{label}:</label>
      <input
        name="productName"
        type={isNumber ? "number" : "text"}
        className="rounded-sm bg-bgBase2 outline p-1"
        defaultValue={product?.[field]}
        onChange={(e) => changeFunc(e, field)}
      />
    </div>
  );
};

export default SingleInput;
