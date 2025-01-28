const CartSummaryHeader = ({ mainText, value, zeroText, type = "$" }) => {
  return (
    <div className="flex justify-between">
      <p>{mainText}</p>
      {type === "$" && value && value > 0 ? (
        <p>${value}</p>
      ) : type === "%" && value && value > 0 ? (
        <p>{value}%</p>
      ) : (
        <p>{zeroText}</p>
      )}
    </div>
  );
};

export default CartSummaryHeader;
