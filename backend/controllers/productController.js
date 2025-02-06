const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");
const Product = require("../models/Products");

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
  sizes = sizes.map((size) => {
    return size.toUpperCase();
  });
  try {
    const filter = { sku };

    const update = {
      $set: {
        productName,
        type,
        price,
        discount,
        colors,
        sizes,
        description,
        tags,
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
