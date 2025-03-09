import SquigglyText from "./cart-components/squigglyText";

const InputBox = ({
  children,
  isEmpty = false,
  changeFunc,
  maxLength = 999,
}) => {
  console.log(children);
  return (
    <>
      {!isEmpty && !children ? (
        <div className="mx-auto loader border border-textDark border-[2px] h-4 w-4 absolute left-4"></div>
      ) : null}

      <input
        type="text"
        defaultValue={!isEmpty ? children : ""}
        className="outline outline-gray-600 p-3 rounded-lg w-full bg-bgBase"
        onChange={changeFunc}
        maxLength={maxLength}
      />
    </>
  );
};

export default InputBox;
