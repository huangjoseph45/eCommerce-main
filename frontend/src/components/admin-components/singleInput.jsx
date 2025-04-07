const SingleInput = ({ label, product, field }) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label htmlFor="productName">{label}:</label>
      <input
        name="productName"
        type="text"
        className="rounded-sm bg-bgBase2 outline p-1"
        defaultValue={product?.[field]}
      />
    </div>
  );
};

export default SingleInput;
