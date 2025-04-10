import { useEffect, useState } from "react";

const useCreateProduct = () => {
  const [loadingProductsCreation, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newProduct, setNewProduct] = useState(null);

  const createProduct = async (
    productData,
    enableTest = false,
    allowModification = false,
    newImages
  ) => {
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
    console.log(newImages);
    try {
      const imageArray = await Promise.all(
        newImages.map(async (formData) => {
          const file = formData.data;
          if (!file) {
            throw new Error("No file found in FormData");
          }
          console.log(formData);
          const base64Data = await fileToBase64(file);
          return {
            fileName: file.name,
            fileData: base64Data,
            idMod: formData.idMod,
            index: formData.index,
          };
        })
      );
      const response = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productData,
          enableTest,
          allowModification,
          newImages: imageArray,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage("Error: " + data.message);
        return;
      }

      const data = await response.json();
      setNewProduct(data.newProduct);
    } catch (e) {
      console.error("Failed to create product: " + e);
      setLoading(false);
    }
  };

  return {
    loadingProductsCreation,
    errorMessage,
    newProduct,
    createProduct,
    setErrorMessage,
  };
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

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove data URL prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default useCreateProduct;
export { useCreateTestProducts };
