import isEmpty from "./isEmpty";
import { findDemoProduct, productImageUrl } from "../../data/demoCatalog";

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
    // A down backend answers non-JSON pages, so only parse JSON bodies.
    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      throw new Error(`Product fetch failed: ${response.status}`);
    }
    const data = await response.json();
    if (!data) return;

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
    } = data;
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
    // Live backend unreachable: serve the matching demo product, if any,
    // in the same shape as a fetched product.
    const demo = findDemoProduct(sku);
    if (!demo) {
      console.error("Error fetching product from server: " + error);
      return;
    }
    const color = sku.split("-")[2];
    const colorObj =
      demo.colors.find((colorItem) => colorItem.idMod === color) ||
      demo.colors[0];
    return {
      ...demo,
      size: sku.split("-")[3],
      color: colorObj,
      imageLink: productImageUrl(demo, colorObj.idMod),
    };
  }
};

export default returnProduct;
