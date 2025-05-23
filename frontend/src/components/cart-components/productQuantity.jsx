import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { ProductContext } from "../utilities/ContextManager";
import useUpdateServerData from "../utilities/updateServerData";

const ProductQuantity = ({ quantity, sku, deleteFunc }) => {
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [value, setValue] = useState(quantity);
  const { isLoading, refetch } = useUpdateServerData({
    dataToUpdate: null,
  });
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setValue(num);
    }
  };

  const submitForm = useCallback(
    (e = null) => {
      if (e.key === "Enter") {
        setUserInfo({
          ...userInfo,
          cart: userInfo.cart.map((product) =>
            product.sku === sku ? { ...product, quantity: value } : product
          ),
        });
        refetch({
          cart: userInfo.cart.map((product) => {
            return product.sku.split()[0] === sku
              ? { ...product, quantity: value }
              : product;
          }),
        });
        if (value === 0) {
          handleDelete();
        }
        inputRef.current.blur();
      } else {
        return;
      }
    },
    [userInfo.cart, value]
  );

  const handleClick = (modifier) => {
    if (value > 0 || modifier > 0) {
      setUserInfo({
        ...userInfo,
        cart: userInfo.cart.map((product) =>
          product.sku === sku
            ? { ...product, quantity: value + modifier }
            : product
        ),
      });
      refetch({
        cart: userInfo.cart.map((product) => {
          return product.sku.split()[0] === sku
            ? { ...product, quantity: value + modifier }
            : product;
        }),
      });
      setValue(value + modifier);
    }

    if (value === 1 && modifier < 0) {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    const updatedCart = userInfo.cart.filter((item) => item.sku !== sku);
    await refetch({ cart: updatedCart });
    setUserInfo((prevUserInfo) => {
      return { ...prevUserInfo, cart: updatedCart };
    });

    deleteFunc(sku, isLoading);
  };

  return (
    <div className="flex flex-row w-full h-fit items-center justify-between">
      <div className="flex flex-row relative w-fit rounded-full border gap-1">
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
          ref={inputRef}
          value={value}
          style={{ outlineStyle: "none" }}
          className="w-10 h-8 text-center outline-none border-none  rounded-none relative box-border flex-grow bg-bgBase"
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
      </div>
      <button
        className=" hover:bg-gray-200 border border-gray-200 hover:bg-opacity-80 rounded-full box-border h-[2rem] w-[2rem] items-center flex justify-center"
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
