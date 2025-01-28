import { useState, useEffect, useContext } from "react";
import returnProduct from "../utilities/returnProduct";
import CartItem from "./cartItem";
import LoadingCart from "./loadingCart";
import { ProductsContext } from "../utilities/ContextManager";

const CartItemList = ({ cart }) => {
  const { products, setProducts } = useContext(ProductsContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productPromises = cart.map((cartItem) =>
          returnProduct(cartItem.productId)
        );

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
            <li key={cartItem.productId} className="list-none py-2">
              Product details not available.
            </li>
          );
        }
        if (!cartItem) return;

        return (
          <CartItem
            key={cartItem.productId}
            productId={cartItem.productId}
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
