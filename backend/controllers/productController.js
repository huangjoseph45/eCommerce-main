const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");
const { Product, StripeProduct, Discount } = require("../models/Products");
const { TestProduct, StripeTestProduct } = require("../models/TestProducts.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createProduct = async (req, res) => {
  let {
    productName,
    type,
    price,
    sku,
    discount,
    colors,
    sizes,
    description,
    tags,
    test,
  } = req.body;

const useTestProducts = test === "true";

  if (
    typeof productName !== "string" ||
    typeof type !== "string" ||
    typeof price !== "number" ||
    typeof sku !== "string" ||
    !Array.isArray(tags) ||
    typeof discount !== "number" ||
    !Array.isArray(colors) ||
    !Array.isArray(sizes) ||
    typeof description !== "string"
  ) {
    console.error("Invalid Input");
    return res.status(400).send("Invalid input");
  }

  sizes = sizes.map((size) => size.toUpperCase());

  try {
    let existingProduct = await (useTestProducts
      ? TestProduct
      : Product
    ).findOne({ sku });

    if (!existingProduct) {
      const stripeProduct = await stripe.products.create({
        name: productName,
        description: description,
        metadata: { sku },
        active: true,
      });

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(price * 100), // Stripe expects price in cents
        currency: "usd",
      });

      const newStripeProduct = await (useTestProducts
        ? StripeTestProduct
        : StripeProduct
      ).findOneAndUpdate(
        { stripeProductId: stripeProduct.id },
        {
          stripeProductId: stripeProduct.id,
          productName,
          metadata: { sku },
          active: true,
          stripePriceId: stripePrice.id,
        },
        { upsert: true, new: true, runValidators: true }
      );

      // Store the product in the database
      const newProduct = await (useTestProducts
        ? TestProduct
        : Product
      ).findOneAndUpdate(
        { sku },
        {
          productName,
          type,
          price,
          discount,
          colors,
          sizes,
          description,
          tags,
          stripeProductId: stripeProduct.id,
        },
        { upsert: true, new: true, runValidators: true }
      );

      return res.status(201).json({ newProduct, newStripeProduct });
    } else {
      return res.status(400).json({ message: "Product already exists" });
    }
  } catch (error) {
    console.error("ERROR WITH PRODUCT CREATION: ", error);
    return res.status(500).json({
      message: "ERROR WITH PRODUCT CREATION",
    });
  }
};

const fetchProduct = async (req, res) => {
  let { skuComplete, test } = req.params;
const useTestProducts = test === "true";
  if (!skuComplete) {
    return res.status(400).json({ message: "Missing SKU" });
  }
  try {
    const sku = skuComplete.split("-")[0] + "-" + skuComplete.split("-")[1];

    let product = await (useTestProducts ? TestProduct : Product).findOne({
      sku: { $regex: `^${sku}$`, $options: "i" },
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res
      .status(500)
      .json({ message: "could not fetch product with SKU " + sku });
  }
};

const fetchCategory = async (req, res) => {
  const { tags, filter, cursor, test } = req.body;
  const useTestProducts = test === "true";
  const cursorIncrement = parseInt(process.env.VITE_CURSOR_INCREMENT);

  let numItems = cursor + cursorIncrement || cursorIncrement;

  const pricesFilter =
    filter && filter.prices
      ? Object.keys(filter.prices)
          .map((key) => {
            const value = filter.prices[key];
            if (!value) return null;

            if (key === "100+") {
              return { finalPrice: { $gte: 100 } };
            }

            const [min, max] = key.split("-").map(Number);
            if (isNaN(min) || isNaN(max)) {
              return null;
            }

            return { finalPrice: { $gte: min, $lt: max } };
          })
          .filter(Boolean)
      : [{ price: { $gte: 0 } }];
  const sortQuery = {
    $sort: (() => {
      if (!filter || !filter.sort) {
        return { createdAt: -1 };
      } else if (filter.sort.newest) {
        return { createdAt: -1 };
      } else if (filter.sort.lowToHigh) {
        return { price: 1 };
      } else if (filter.sort.highToLow) {
        return { price: -1 };
      }
      return { createdAt: -1 }; // Default case
    })(),
  };

  const filterQuery = {
    $or:
      pricesFilter.length > 0 ? pricesFilter : { finalPrice: { $gte: 99999 } },
  };

  try {
    const joinedTags = tags && !tags.includes("*") ? tags.join("|") : "";
    const products = await (useTestProducts ? TestProduct : Product).aggregate([
      {
        $addFields: {
          finalPrice: {
            $multiply: [
              "$price",
              { $subtract: [1, { $divide: ["$discount", 100] }] },
            ],
          },
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { tags: { $regex: joinedTags, $options: "i" } },
                { productName: { $regex: joinedTags, $options: "i" } },
                { description: { $regex: joinedTags, $options: "i" } },
              ],
            },
            filterQuery,
          ],
        },
      },
      sortQuery,
      { $limit: numItems },
    ]);

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res.status(500).json({ message: "Unable to fetch products" });
  }
};

const findPromo = async (req, res) => {
  const { code } = req.params;
  try {
    if (!code) return res.status(400).json({ message: "No query" });
    const foundDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (!foundDiscount) return res.status(204).json({ message: null });

    return res.status(200).json(foundDiscount);
  } catch (error) {
    return res.status(500).json({ Message: error });
  }
};

const createDiscount = async (req, res) => {
  let { code, value, validProducts } = req.body;
  if (!validProducts) validProducts = [];
  try {
    if (!code || !value)
      return res.status(400).json({ message: "No code/value" });
    const new_discount = Discount.create({
      code: code.toUpperCase(),
      value: value,
      validProducts: validProducts,
    });

    return res.status(200).json(new_discount);
  } catch (error) {
    return res.status(500).json({ Message: error });
  }
};

module.exports = {
  createProduct,
  fetchProduct,
  fetchCategory,
  findPromo,
  createDiscount,
};
