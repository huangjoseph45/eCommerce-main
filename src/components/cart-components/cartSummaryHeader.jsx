import SquigglyText from "./squigglyText";
const CartSummaryHeader = ({
  mainText,
  value,
  zeroText,
  type = "$",
  prefix = "$",
  postfix,
  loading,
}) => {
  return (
    <div className="flex justify-between">
      <p>{mainText}</p>
      {value && value > 0 ? (
        <p>
          {prefix && prefix}
          {value}
          {postfix && postfix}
        </p>
      ) : !loading && !value ? (
        <p>{zeroText}</p>

      ) : ( <div className="w-[5rem]">
        <SquigglyText />
      </div>
      )}
    </div>
  );
};

export default CartSummaryHeader;
