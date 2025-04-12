import isEmpty from "./isEmpty";

const returnProduct = async (sku, enableTest = false) => {
  if (isEmpty(sku)) {
    console.error("Invalid SKU");
    return;
  }

  if (typeof enableTest !== "boolean") return;

  let seoValue = 0;
  let storedClickedValues =
    JSON.parse(sessionStorage.getItem("clickedProducts")) || {};

  if (!storedClickedValues[sku]) {
    seoValue = 1;
    storedClickedValues[sku] = true;

    sessionStorage.setItem(
      "clickedProducts",
      JSON.stringify(storedClickedValues)
    );
  }

  const [prefix, skuNum, color, size] = sku.split("-");
  const fetchURL = `${import.meta.env.VITE_PATH}/products/fetch-product/${
    prefix + "-" + skuNum
  }/${enableTest}/${seoValue}`;
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
      tags,
      clicks,
      sizes,
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
      tags,
      clicks,
      sizes,
      colors,
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

export default returnProduct;
