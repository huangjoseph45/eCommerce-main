import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { userInfo } = useContext(ProductContext);
  const [numItems, setNumItems] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (userInfo?.cart && Array.isArray(userInfo.cart)) {
      const num = userInfo.cart.reduce((total, item) => {
        return item !== undefined && typeof item.quantity === "number"
          ? total + item.quantity
          : total;
      }, 0);

      setNumItems(num);
    }
  }, [userInfo]);

  const handleClick = () => {
    const cookies = document.cookie;
    if (cookies.includes("sessionId")) nav("/cart");
    else nav("/login");
  };

  return (
    <button
      className="flex items-center justify-center relative cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 rounded-full p-2 transition-all duration-300 aspect-square"
      aria-label="Cart"
      onClick={handleClick}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        role="img"
        width="40px"
        height="40px"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"
        ></path>
      </svg>
      {numItems > 0 && (
        <span
          className="absolute text-textDark font-semibold text-[0.8rem] flex items-center justify-center rounded-full p-2  select-none translate-y-[5%]"
          aria-label={`${numItems} items in cart`}
        >
          {numItems}
        </span>
      )}
    </button>
  );
};

export default Cart;
