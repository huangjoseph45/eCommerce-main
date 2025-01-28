import { useContext, useState, useRef, useEffect } from "react";
import { ProductContext } from "../utilities/ContextManager";

const ProductQuantity = ({ quantity, productId, deleteFunc }) => {
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [value, setValue] = useState(quantity);
  const handleChange = (e) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setValue(num);
    }
  };

  const submitForm = (e = null) => {
    if (e.key === "Enter") {
      setUserInfo({
        ...userInfo,
        cart: userInfo.cart.map((product) => {
          return product.productId.split()[0] === productId
            ? { ...product, quantity: value }
            : product;
        }),
      });
    } else {
      return;
    }
  };

  const handleClick = (modifier) => {
    if (value > 0 || modifier > 0)
      setUserInfo({
        ...userInfo,
        cart: userInfo.cart.map((product) => {
          return product.productId.split()[0] === productId
            ? { ...product, quantity: value + modifier }
            : product;
        }),
      });
    setValue(value + modifier);
    if (value === 1 && modifier < 0) {
      handleDelete();
    }
  };

  const handleDelete = () => {
    setUserInfo({
      ...userInfo,
      cart: userInfo.cart.filter((item) => {
        console.log(item);
        return item.productId !== productId;
      }),
    });
    deleteFunc(productId);
  };
  return (
    <div className="flex flex-row relative w-full rounded-full border">
      <button
        onClick={() => handleClick(-1)}
        className=" relative text-xl  w-8 h-8 rounded-full hover:bg-gray-200 hover:bg-opacity-80 transition-all duration-100 z-1 text-center flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="1.5"
            d="M18 12H6"
          ></path>
        </svg>
      </button>
      <input
        type="text"
        value={value}
        className="w-8 h-8 text-center  rounded-none relative box-border flex-grow"
        maxLength={2}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => submitForm(e)}
      />
      <button
        onClick={() => handleClick(1)}
        className="relative text-xl  w-8 h-8 rounded-full hover:bg-gray-200 hover:bg-opacity-80 transition-all duration-100 z-1 flex items-center justify-center"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="1.5"
            d="M18 12H6m6 6V6"
          ></path>
        </svg>
      </button>
      <button
        className="absolute left-full top-1/2 -translate-y-1/2 translate-x-2 hover:bg-gray-200 border border-gray-200 hover:bg-opacity-80 p-2 rounded-full box-border"
        onClick={handleDelete}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="1.5"
            d="M13.75 10v7m-3.5-7v7m-3.5-8.5V17c0 1.24 1.01 2.25 2.25 2.25h6c1.24 0 2.25-1.01 2.25-2.25V7.75h2.25m-10-3h3.75c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H4.5"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ProductQuantity;
