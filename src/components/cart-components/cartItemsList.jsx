import { useState, useEffect } from "react";
import CartItem from "./cartItem";
import LoadingCart from "./loadingCart";
import useUpdateServerData from "../utilities/updateServerData";

const CartItemList = ({ cart, setCart, loading, products, error }) => {
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });

  const purgeCart = () => {
    setCart(null);

    refetch({ cart: [] });
  };
  if (loading) {
    return <LoadingCart />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cart || cart.length === 0) {
    return <p className="my-4 text-base">Your cart is empty.</p>;
  }

  return (
    <ul className="w-fit flex flex-col items-center mx-auto">
      <h1 className="text-2xl my-2 mt-4 flex items-center self-start">Bag</h1>
      {products.map((product, index) => {
        const cartItem = cart[index]; // Corresponding cart item
        if (!product) {
          return (
            <li
              key={cartItem.sku}
              className="list-none hover:bg-errorTrue/30 rounded-md cursor-pointer p-2 transition-all duration-100"
              onClick={purgeCart}
            >
              Product details not available.
            </li>
          );
        }
        if (!cartItem) return;
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
    </ul>
  );
};

export default CartItemList;
