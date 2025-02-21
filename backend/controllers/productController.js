const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");
const { Product, StripeProduct, Discount } = require("../models/Products");
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
    // Check if the product already exists
    let existingProduct = await Product.findOne({ sku });

    if (!existingProduct) {
      // Create a new product in Stripe
      const stripeProduct = await stripe.products.create({
        name: productName,
        description: description,
        metadata: { sku },
        active: true,
      });

      const newStripeProduct = await StripeProduct.findOneAndUpdate(
        { stripeProductId: stripeProduct.id },
        {
          stripeProductId: stripeProduct.id,
          productName,
          metadata: { sku },
          active: true,
        },
        { upsert: true, new: true, runValidators: true }
      );

      // Store the product in the database
      const newProduct = await Product.findOneAndUpdate(
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
  let { skuComplete } = req.params;
  if (!skuComplete) {
    return res.status(400).json({ message: "Missing SKU" });
  }
  try {
    const sku = skuComplete.split("-")[0] + "-" + skuComplete.split("-")[1];

    let product = await Product.findOne({
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
  const { query } = req.params;

  const categories = query.split("-");

  try {
    const products =
      categories[0] === "*"
        ? await Product.find()
        : await Product.find({
            $or: [
              { tags: { $regex: categories.join("|"), $options: "i" } },
              { productName: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
            ],
          });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res
      .status(500)
      .json({ message: "could not fetch product with id " + query });
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
