const MONGO_URI = process.env.MONGO_URI;
const { Product, StripeProduct, Discount } = require("../models/Products");
const { TestProduct, StripeTestProduct } = require("../models/TestProducts.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const useTestProducts = false;

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

  if (!skuComplete) {
    return res.status(400).json({ message: "Missing SKU" });
  }

  try {
    const [first, second] = skuComplete.split("-");
    const sku = `${first}-${second}`;

    let product = await (useTestProducts
      ? TestProduct
      : Product
    ).findOneAndUpdate(
      { sku: { $regex: `^${sku}$`, $options: "i" } },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Could not fetch product with SKU " + skuComplete });
  }
};

const fetchCategory = async (req, res) => {
  const { tags, filter, cursor, test, isSearch } = req.body;
  const cursorIncrement = parseInt(process.env.VITE_CURSOR_INCREMENT);

  let numItems = cursor + cursorIncrement || cursorIncrement;
  console.log("TEST" + useTestProducts);

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
    console.log(tags.join("|"));

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
                {
                  tags: {
                    $all: tags.map((tag) => new RegExp(tag, "i")),
                  },
                },
                ...(isSearch
                  ? [
                      {
                        $or: [
                          {
                            productName: {
                              $regex: tags.join("|"),
                              $options: "i",
                            },
                          },
                          {
                            description: {
                              $regex: tags.join("|"),
                              $options: "i",
                            },
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            },
            filterQuery,
          ],
        },
      },
      sortQuery,
      { $limit: numItems },
    ]);

    console.log({
      productName: {
        $regex: tags.join("|"),
        $options: "i",
      },
      description: {
        $regex: tags.join("|"),
        $options: "i",
      },
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res.status(500).json({ message: "Unable to fetch products" });
  }
};

// In progress
// Fetches top products for a set of tags. Chooses the product with most clicks that also abides by the tags filter
const fetchTopProducts = async (req, res) => {
  const { test, tagArray, numProductsPerTag, strict } = req.body;

  if (!tagArray || tagArray.length < 1 || numProductsPerTag < 1) {
    return res.status(400).json({ error: "Invalid Operation" });
  }

  try {
    const foundProducts = await (useTestProducts
      ? TestProduct
      : Product
    ).aggregate([
      {
        $match: strict
          ? {
              $and: tagArray.map((tag) => ({
                tags: { $regex: tag, $options: "i" },
              })),
            }
          : {
              $or: tagArray.map((tag) => ({
                tags: { $regex: tag, $options: "i" },
              })),
            },
      },
      { $sort: { clicks: -1 } },
      { $limit: numProductsPerTag },
    ]);

    if (foundProducts.length < 1) {
      return res.status(400).json({ error: "No products found" });
    }
    return res.status(200).json({ foundProducts });
  } catch (error) {
    console.error("ERROR: " + error);
    return res.status(500).json({ error: error });
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
  fetchTopProducts,
};
