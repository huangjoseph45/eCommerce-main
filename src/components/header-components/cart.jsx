import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useContext, useEffect } from "react";
import { ProductContext } from "../utilities/ProductContext";

const Cart = () => {
  const { userInfo, setUserInfo } = useContext(ProductContext);

  useEffect(() => {
    if (!userInfo.cart) {
      setUserInfo({ ...userInfo, cart: [] });
    }
  }, [userInfo, setUserInfo]);

  const numItems = useMemo(() => {
    if (!userInfo.cart) return 0;
    console.log(userInfo);
    return userInfo.cart.reduce((total, item) => total + item.quantity, 0);
  }, [userInfo.cart]);

  return (
    <button
      className="flex items-center justify-center relative cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 rounded-full p-3 transition-all duration-300"
      aria-label="Cart"
    >
      <FontAwesomeIcon
        className="text-black cursor-pointer size-8 md:size-6 relative"
        icon={faCartShopping}
        title="Cart"
      />
      {numItems > 0 && (
        <span
          className="absolute text-white font-semibold text-[.5rem] flex items-center justify-center rounded-full p-2 translate-x-[10%] top-1/2 -translate-y-[65%] select-none"
          aria-label={`${numItems} items in cart`}
        >
          {numItems}
        </span>
      )}
    </button>
  );
};

export default Cart;
