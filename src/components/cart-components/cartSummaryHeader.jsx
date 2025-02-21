import SquigglyText from "./squigglyText";
const CartSummaryHeader = ({
  mainText,
  value,
  zeroText,
  type = "$",
  loading,
}) => {
  return (
    <div className="flex justify-between">
      <p>{mainText}</p>
      {type === "$" && value && value > 0 ? (
        <p>${value}</p>
      ) : type === "%" && value && value > 0 ? (
        <p>{value}%</p>
      ) : loading ? (
        <div className="w-[5rem]">
          {" "}
          <SquigglyText />
        </div>
      ) : (
        <p>{zeroText}</p>
      )}
    </div>
  );
};

export default CartSummaryHeader;
