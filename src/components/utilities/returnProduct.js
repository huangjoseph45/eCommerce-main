import isEmpty from "./isEmpty";

const returnProduct = async (sku) => {
  if (isEmpty(sku)) {
    console.error("Invalid SKU");
    return;
  }

  const [prefix, skuNum, color, size] = sku.split("-");

  const fetchURL = `http://localhost:2000/api/products/fetch-product/${
    prefix + "-" + skuNum
  }`;
  try {
    const response = await fetch(fetchURL, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const {
      createdAt,
      description,
      sku,
      price,
      productName,
      type,
      discount,
      colors,
    } = await response.json();
    const imageLink = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
      sku + "-" + color
    }`;

    const colorObj = colors.find((colorItem) => {
      return colorItem.idMod === color;
    });
    return {
      createdAt,
      description,
      sku,
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
