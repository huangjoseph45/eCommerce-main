const mongoose = require("mongoose");

// Define the Color Subschema
const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
    },
    colorCode: {
      type: String,
      required: [true, "Color code is required"],
      match: [/^#([0-9A-F]{3}){1,2}$/i, "Please fill a valid hex color code"],
    },
    idMod: {
      type: String,
      required: [true, "Color modifier ID is required"],
      trim: true,
    },
  },
  { _id: false }
); // Prevent creation of separate _id for subdocuments

const stripeTestProductSchema = new mongoose.Schema({
  stripeProductId: { type: String, required: true, unique: true }, // Stripe product ID
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Store in cents for accuracy
  currency: { type: String, default: "usd" },
  images: [{ type: String }], // Array of image URLs
  metadata: { type: Map, of: String }, // Store additional Stripe metadata
  stripePriceId: { type: String, required: true, unique: true }, // Stripe price ID
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Define the Product Schema
const testProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      trim: true,
      enum: {
        values: [
          "Men's Clothing",
          "Women's Clothing",
          "Accessories",
          "Footwear",
          "Others",
        ],
        message: "{VALUE} is not a valid product type",
      },
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    tags: {
      type: [String],
      set: (tags) => tags.map((tag) => tag.toLowerCase()),
    },
    sku: {
      // Renamed from 'id' to 'sku' for clarity
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z0-9\-]+$/,
        "SKU can only contain uppercase letters, numbers, and hyphens",
      ],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    colors: {
      type: [colorSchema],
      validate: [arrayLimit, "A product must have at least one color"],
    },
    sizes: {
      type: [String],
      enum: {
        values: ["XS", "S", "M", "L", "XL", "XXL"],
        message: "{VALUE} is not a valid size",
      },
      default: ["M"], // Default size if none provided
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    taxcode: {
      type: String,
      required: true,
      enum: {
        values: ["txcd_99999999", "txcd_00000000"],
        message: "{VALUE} is not a valid tax code",
      },
      trim: true,
    },
    stripeProductId: String,
    stripePriceId: String,
    stripePrice: Object,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Validation Function to Ensure At Least One Color
function arrayLimit(val) {
  return val.length > 0;
}

// Create Indexes
testProductSchema.index({ productName: "text", description: "text" }); // For text search

// Export the Product Model

const TestProduct = mongoose.model("TestProduct", testProductSchema);
const StripeTestProduct = mongoose.model(
  "StripeTestProduct",
  stripeTestProductSchema
);

module.exports = { TestProduct, StripeTestProduct };
