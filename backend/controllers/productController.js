const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");
const Product = require("../models/Products");

const createProduct = async (req, res) => {
  let { productName, type, price, id, discount, colors, sizes, description } =
    req.body;

  if (
    typeof productName !== "string" ||
    typeof type !== "string" ||
    typeof price !== "number" ||
    typeof id !== "string" ||
    typeof discount !== "number" ||
    !Array.isArray(colors) ||
    !Array.isArray(sizes) ||
    typeof description !== "string"
  ) {
    return res.status(400).send("Invalid input");
  }
  sizes = sizes.map((size) => {
    return size.toUpperCase();
  });
  try {
    const filter = { id }; // Replace with {_id: id} if using MongoDB's default identifier

    const update = {
      $set: {
        productName,
        type,
        price,
        discount,
        colors,
        sizes,
        description,
      },
    };

    const options = { upsert: true, new: true, runValidators: true };
    const new_product = await Product.findOneAndUpdate(filter, update, options);
    return new_product;
  } catch (error) {
    console.error("ERROR WITH PRODUCT CREATION: " + error);
    return res.status(500).json({
      message: "ERROR WITH PRODUCT CREATION",
    });
  }
};

const fetchProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOne({ id: productId });
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product: " + error);
    return res
      .status(500)
      .json({ message: "could not fetch product with id " + productId });
  }
};

module.exports = {
  createProduct,
  fetchProduct,
};
