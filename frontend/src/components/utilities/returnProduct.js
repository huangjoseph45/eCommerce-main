import isEmpty from "./isEmpty";

const returnProduct = async (sku, enableTest = false) => {

  if (isEmpty(sku)) {
    console.error("Invalid SKU");
    return;
  }

  if (typeof enableTest !== "boolean") return;

  const [prefix, skuNum, color, size] = sku.split("-");
  const fetchURL = `${import.meta.env.VITE_PATH}/products/fetch-product/${
    prefix + "-" + skuNum
  }/${enableTest}`;
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
      stripePriceId,
      stripeProductId,
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
      stripePriceId,
      stripeProductId,
    };
  } catch (error) {
    console.error("Error fetching product from server: " + error);
    return;
  }
};

const returnBaseProduct = async (sku, enableTest = false) => {
  if (isEmpty(sku)) {
    console.error("Invalid SKU");
    return;
  }

  const fetchURL = `${
    import.meta.env.VITE_PATH
  }/products/fetch-product/${sku}/${enableTest}`;
  try {
    console.log(fetchURL);
    console.log(enableTest)

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
      sizes,
      discount,
      colors,
      stripePriceId,
      stripeProductId,
    } = await response.json();
    return {
      createdAt,
      description,
      sku,
      price,
      productName,
      sizes,
      type,
      colors,
      discount,
      stripePriceId,
      stripeProductId,
    };
  } catch (error) {
    console.error("Error fetching product from server: " + error);
    return;
  }
};

export default returnProduct;
export { returnBaseProduct };
