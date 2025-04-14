import { useState } from "react";

const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const deleteProduct = async (sku) => {
    if (!sku) {
      setError("No product was given to delete");
      return false;
    }
    setLoading(true);
    try {
      const path = `${
        import.meta.env.VITE_PATH
      }/products/delete-product/${sku}`;
      const response = await fetch(path, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const data = await response.json();
        setError("Error: " + data.message);
        return;
      }
      setLoading(false);
      return true;
    } catch (error) {
      setError(error);
      console.error(error);
      setLoading(false);
      return false;
    }
  };

  return { loading, error, deleteProduct };
};

export default useDeleteProduct;
