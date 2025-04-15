const MONGO_URI = process.env.MONGO_URI;
const { Product, StripeProduct, Discount } = require("../models/Products");
const { TestProduct, StripeTestProduct } = require("../models/TestProducts.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fs = require("fs");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const useTestProducts = false;

const deleteProduct = async (req, res) => {
  const { sku } = req.params;
  try {
    const existingProduct = await Product.findOne({ sku });
    if (!existingProduct?.sku) {
      return res
        .status(400)
        .json({ message: "Product to delete could not be found" });
    }
    const s3 = new S3Client({
      region: process.env.REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const deleteFiles = async (product) => {
      const uploadPromises = product?.colors.map((color) => {
        Array.from({
          length: color.numImages,
        }).map((index) => {
          return new Promise(async (resolve, reject) => {
            const uploadParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `${product.sku}-${color.idMod}${
                index === 0 ? "" : `-${index}`
              }`,
              ACL: "public-read",
              ContentType: "image/jpeg",
            };

            try {
              const result = await s3.send(
                new DeleteObjectCommand(uploadParams)
              );
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        });
      });

      try {
        await Promise.all(uploadPromises);
        console.log("All files deleted successfully!");
        return true;
      } catch (err) {
        console.error("Error deleted one or more files:", err);
        return false;
      }
    };
    deleteFiles(existingProduct);

    const s3DeleteFiles = await deleteFiles(existingProduct);
    if (!s3DeleteFiles) {
      return res.status(500).json({ error: "Error deleting files from S3" });
    }

    const deletedProductDocument = await Product.deleteOne({ sku: sku });
    if (deletedProductDocument.deletedCount < 1) {
      return res.status(500).json({ error: "Failed to delete from mongoDB" });
    }
    return res.status(200).json({ message: "Documents deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

const createProduct = async (req, res) => {
  let { productData, test, allowModification, newImages } = req.body;

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
  } = productData;

  if (
    typeof productName !== "string" ||
    typeof type !== "string" ||
    isNaN(price) ||
    typeof sku !== "string" ||
    !Array.isArray(tags) ||
    isNaN(discount) ||
    !Array.isArray(colors) ||
    !Array.isArray(sizes) ||
    typeof description !== "string"
  ) {
    console.error();

    console.error(typeof productName !== "string");
    console.error(typeof type !== "string");
    console.error(!isNumeric(price));
    console.error(typeof sku !== "string");
    console.error(!Array.isArray(tags));
    console.error(!isNumeric(discount));
    console.error(!Array.isArray(colors));
    console.error(!Array.isArray(sizes));
    console.error(typeof description !== "string");
    console.error("Invalid Input");
    return res.status(400).send("Invalid input");
  }
  sku = sku.toUpperCase();
  const idMods = colors.map((c) => c.idMod).sort();
  const isValidColors = colors.every(
    (c) =>
      c.idMod &&
      c.colorName &&
      c.colorCode?.length === 7 &&
      idMods.indexOf(c.idMod) === idMods.lastIndexOf(c.idMod)
  );
  if (!isValidColors) {
    return res.status(400).json({ error: "Color field is invalid" });
  }
  const hasDuplicates = (arr) =>
    arr.some((val, i) => !val?.length || arr.indexOf(val) !== i);

  if (hasDuplicates(sizes)) {
    return res.status(400).json({ error: "Size field is invalid" });
  }

  if (hasDuplicates(tags)) {
    return res.status(400).json({ error: "Tag field is invalid" });
  }

  try {
    let existingProduct = await (useTestProducts
      ? TestProduct
      : Product
    ).findOne({ sku });
    if (!existingProduct || allowModification) {
      // const s3 = new AWS.S3();

      const s3 = new S3Client({
        region: process.env.REGION || "us-east-2", // e.g., "us-east-1"
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      for (const image of newImages) {
        if (!image.fileName || !image.fileData) {
          return res.status(400).json({ error: "Invalid Image Fields" });
        }
        // const params = {
        //   Bucket: process.env.S3_BUCKET_NAME, // your S3 bucket name
        //   Key: `${sku}-${image.idMod}-${image.index}`,
        //   Body: image.fileData, // The file content
        //   ACL: "public-read",
        // };
      }
      const uploadFiles = async (files) => {
        const uploadPromises = files.map((file, index) => {
          const fileBuffer = Buffer.from(file.fileData, "base64");

          return new Promise(async (resolve, reject) => {
            const uploadParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `${sku}-${file.idMod}${
                file.index === 0 ? "" : `-${file.index}`
              }`,
              Body: fileBuffer,
              ACL: "public-read",
              ContentType: "image/jpeg",
            };

            try {
              const result = await s3.send(new PutObjectCommand(uploadParams));
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        });

        try {
          await Promise.all(uploadPromises);
          console.log("All files uploaded successfully!");
          return true;
        } catch (err) {
          console.error("Error uploading one or more files:", err);
          return false;
        }
      };

      const s3UploadFileRes = await uploadFiles(newImages);
      if (!s3UploadFileRes) {
        return res.status(500).json({ error: "Error uploading files to S3" });
      }

      newImages.forEach((obj) => {
        let matchIndex = colors.findIndex((color) => color.idMod === obj.idMod);
        if (matchIndex !== -1) {
          colors[matchIndex] = {
            ...colors[matchIndex],
            numImages:
              (!isNaN(colors[matchIndex].numImages)
                ? colors[matchIndex].numImages
                : 0) + 1,
          };
        }
      });

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
      console.log(description);
      return res.status(201).json({ newProduct, newStripeProduct });
    } else {
      return res.status(400).json({ error: "Product already exists" });
    }
  } catch (error) {
    console.error("ERROR WITH PRODUCT CREATION: ", error);
    return res.status(500).json({
      message: "ERROR WITH PRODUCT CREATION",
    });
  }
};

const fetchProduct = async (req, res) => {
  let { skuComplete, test, seoValue } = req.params;
  if (!seoValue) seoValue = 1;
  if (!skuComplete) {
    return res.status(400).json({ message: "Missing SKU" });
  }

  try {
    const [first, second] = skuComplete.split("-");
    const sku = `${first}-${second}`;

    const product = await (useTestProducts
      ? TestProduct
      : Product
    ).findOneAndUpdate(
      { sku: { $regex: `^${sku}$`, $options: "i" } },
      { $inc: { clicks: seoValue } },
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

const updateProductSEOValue = async (req, res) => {
  if (req.headers.origin !== process.env.VITE_CLIENT_PATH) {
    return res.status(400).json({ message: "Invalid Origin" });
  }

  let { sku, SEOValue } = req.params;

  if (!SEOValue || SEOValue < 1) SEOValue = 1;
  try {
    if (!sku) {
      return res.status(400).json({ message: "Missing product sku" });
    }
    const foundProduct = await (useTestProducts
      ? TestProduct
      : Product
    ).findOneAndUpdate(
      { sku: { $regex: `^${sku}$`, $options: "i" } },
      { $inc: { clicks: SEOValue } },
      { new: true }
    );
    console.log(foundProduct);
    return res.status(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Failed to update seo values" });
  }
};

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
  updateProductSEOValue,
  deleteProduct,
};

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
