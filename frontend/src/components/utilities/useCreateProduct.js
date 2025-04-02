import { useEffect, useState } from "react";

const useCreateProduct = () => {
  const [loadingProductsCreation, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newProduct, setNewProduct] = useState(null);

  const createProduct = async (productData, enableTest) => {
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

    productData["test"] = enableTest;
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
        const data = await response.json();
        console.log(data);
        return;
      }

      const data = await response.json();
      console.log(data);
      setNewProduct(data.newProduct);
    } catch (e) {
      console.error("Failed to create product: " + e);
      setLoading(false);
    }
  };

  return { loadingProductsCreation, errorMessage, newProduct, createProduct };
};

const useCreateTestProducts = () => {
  const { loadingProductsCreation, errorMessage, newProduct, createProduct } =
    useCreateProduct();

  const createTestProducts = async (number) => {
    try {
      for (let i = 1; i <= number; i++) {
        console.log("running");

        // Adjusted to include the "number" value
        console.log(i);
        const product = {
          sku: `SKU-${i}`,
          colors: [
            { colorName: "Dark Blue", colorCode: "#30364e", idMod: "dbl" },
            { colorName: "Seafoam", colorCode: "#73a899", idMod: "sfm" },
            { colorName: "Tan", colorCode: "#9c8d7b", idMod: "tan" },
            { colorName: "White", colorCode: "#eaeaea", idMod: "whi" },
          ],
          description:
            "We've brought back these 6-inch-inseam shorts from our archives and updated them with a comfortable drawstring waist and a touch of stretch.",
          discount: 0,
          price: 10 + Math.ceil(190 * Math.random()),
          productName: `Test Product ${i}`,
          sizes: ["XS", "S", "M", "L", "XL"],
          tags: ["new", "men", "women"],
          type: "Men's Clothing",
        };

        const res = await createProduct(product, true);
        console.log(res);
      }
    } catch (e) {
      console.error("Failed to create product: " + e);
    }
  };

  return { createTestProducts };
};

export default useCreateProduct;
export { useCreateTestProducts };
