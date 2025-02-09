const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");
const { Product, StripeProduct } = require("../models/Products");
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

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: price * 100, // Convert to cents
        currency: "usd",
      });

      const newStripeProduct = await StripeProduct.findOneAndUpdate(
        { stripeProductId: stripeProduct.id },
        {
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
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
          stripePriceId: stripePrice.id,
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
  console.log(req.params);
  let { sku } = req.params;
  if (!sku) {
    return res.status(400).json({ message: "Missing SKU" });
  }
  try {
    const product = await Product.findOne({
      sku: { $regex: `^${sku}$`, $options: "i" },
    });
    console.log(product);
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res
      .status(500)
      .json({ message: "could not fetch product with SKU " + sku });
  }
};

const fetchCategory = async (req, res) => {
  const { category } = req.params;

  const query = category.toLowerCase();

  try {
    const products =
      query === "*"
        ? await Product.find()
        : await Product.find({
            $or: [
              { tags: { $in: [query] } },
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

module.exports = {
  createProduct,
  fetchProduct,
  fetchCategory,
};
