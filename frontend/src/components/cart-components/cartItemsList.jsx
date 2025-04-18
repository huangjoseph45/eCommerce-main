import { useState, useEffect } from "react";
import CartItem from "./cartItem";
import LoadingCart from "./loadingCart";
import useUpdateServerData from "../utilities/updateServerData";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import LoginModal from "../loginModal";
import useAuth from "../utilities/useAuth";

const CartItemList = ({
  userInfo,
  cart,
  setCart,
  loading = true,
  products,
  error,
}) => {
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });
  const nav = useNavigate();
  const { loggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const purgeCart = () => {
    setCart(null);
    sessionStorage.clear("userInfo");
    refetch({ cart: [] });
  };

  return (
    <ul className="flex flex-col items-center mx-auto min-w-[20rem] w-full max-w-[30rem]">
      <ul className="flex flex-col gap-2 h-fit w-full">
        {!loading ? (
          products?.length > 0 ? (
            <>
              <h1 className="text-2xl my-2 mt-4 flex items-center self-start">
                Bag
              </h1>
              {products.map((product, index) => {
                const cartItem = cart[index]; // Corresponding cart item
                if (!product) {
                  return (
                    <li
                      key={cartItem?.sku || index} // Ensure key exists
                      className="list-none hover:bg-errorTrue/30 rounded-md cursor-pointer p-2 transition-all duration-100"
                      onClick={purgeCart}
                    >
                      Product details not available.
                    </li>
                  );
                }
                if (!cartItem) return null;
                return (
                  <CartItem
                    key={cartItem.sku}
                    sku={cartItem.sku}
                    imageLink={product.imageLink}
                    productName={product.productName}
                    quantity={cartItem.quantity}
                    price={product.price}
                    discount={product.discount}
                    color={product.color}
                    type={product.type}
                    size={product.size}
                    description={product.description}
                  />
                );
              })}
            </>
          ) : !loading &&
            (!userInfo?.cart || userInfo?.cart?.length == 0) &&
            (!cart || cart.length == 0) ? (
            <>
              <h1 className=" text-3xl mx-auto mt-24 mb-4">
                Your cart is empty.
              </h1>
              <LoginModal
                showLogin={showLoginModal}
                setShowLogin={setShowLoginModal}
              />

              <div className="w-[18rem] mx-auto h-[20vh]">
                <Button
                  buttonFunc={() => nav("/s")}
                  buttonText={"Continue Shopping"}
                />
                {!loggedIn && (
                  <div className="flex flex-row w-full justify-center gap-4 mt-2">
                    <button
                      onClick={() => {
                        setShowLoginModal("login");
                      }}
                      className="text-xl bg-bgSecondary w-1/2 text-bgBase3 px-4 py-2 rounded-md hover:outline hover:outline-2 outline-bgTertiary"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setShowLoginModal("create")}
                      className="text-xl bg-bgTertiary w-1/2 text-bgBase3 px-4 py-2 rounded-md hover:outline hover:outline-2 outline-bgSecondary"
                    >
                      Join Us
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <LoadingCart />
          )
        ) : (
          <LoadingCart />
        )}
      </ul>
    </ul>
  );
};

export default CartItemList;
