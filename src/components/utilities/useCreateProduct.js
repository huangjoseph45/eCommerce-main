import { useState } from "react";

const useCreateProduct = () => {
  const [loadingProductsCreation, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newProduct, setNewProduct] = useState(null);

  const createProduct = async (productData) => {
    const path = `${import.meta.env.VITE_PATH}/products/create-product`;

    if (
      !(
        productData &&
        productData.productName &&
        productData.type &&
        productData.price &&
        productData.sizes &&
        productData.colors &&
        productData.description &&
        productData.sku &&
        productData.type &&
        productData.tags
      )
    ) {
      setErrorMessage("Missing required fields");
      console.error("error creating product");
      return;
    }
    try {
      const response = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        setErrorMessage("Product Creation Response was not OK");
        console.error("failed to create product");
        return;
      }

      const data = await response.json();
      setNewProduct(data.newProduct);
    } catch (e) {
      console.error("Failed to create product: " + e);
      setLoading(false);
    }
  };

  return { loadingProductsCreation, errorMessage, newProduct, createProduct };
};

export default useCreateProduct;
