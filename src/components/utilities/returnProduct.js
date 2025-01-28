import isEmpty from "./isEmpty";

const returnProduct = async (productId) => {
  if (isEmpty(productId)) {
    console.error("Invalid productId");
    return;
  }

  const [baseId, color, size] = productId.split("-");
  const fetchURL = `http://localhost:2000/api/products/fetch-product/${baseId}`;
  try {
    const response = await fetch(fetchURL, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const {
      createdAt,
      description,
      id,
      price,
      productName,
      type,
      discount,
      colors,
    } = await response.json();
    const imageLink = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
      baseId + "-" + color
    }`;

    const colorObj = colors.find((colorItem) => {
      return colorItem.idMod === color;
    });
    return {
      createdAt,
      description,
      id,
      price,
      productName,
      size,
      type,
      color: colorObj,
      imageLink,
      discount,
    };
  } catch (error) {
    console.error("Error fetching product from server: " + error);
    return;
  }
};

export default returnProduct;
