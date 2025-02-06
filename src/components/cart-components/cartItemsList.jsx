import { useState, useEffect } from "react";
import returnProduct from "../utilities/returnProduct";
import CartItem from "./cartItem";
import LoadingCart from "./loadingCart";
import useUpdateServerData from "../utilities/updateServerData";

const CartItemList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoading, response, errorCode, refetch, setErrorCode } =
    useUpdateServerData({
      dataToUpdate: null,
    });

  const purgeCart = () => {
    setCart(null);

    refetch({ cart: [] });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productPromises = cart.map((cartItem) => {
          return returnProduct(cartItem.sku);
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (cart && cart.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [cart]);

  if (loading) {
    return <LoadingCart />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cart || cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <ul>
      {products.map((product, index) => {
        const cartItem = cart[index]; // Corresponding cart item
        if (!product) {
          return (
            <li
              key={cartItem.sku}
              className="list-none hover:bg-red-300 rounded-md cursor-pointer p-2 transition-all duration-100"
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
