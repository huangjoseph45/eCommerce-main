const { trim } = require("lodash");
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

// Define the Product Schema
const productSchema = new mongoose.Schema(
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
    id: {
      type: String,
      required: true,
      trim: true,
    },
    // sku: {
    //   // Renamed from 'id' to 'sku' for clarity
    //   type: String,
    //   required: [true, "SKU is required"],
    //   unique: true,
    //   trim: true,
    //   uppercase: true,
    //   match: [
    //     /^[A-Z0-9\-]+$/,
    //     "SKU can only contain uppercase letters, numbers, and hyphens",
    //   ],
    // },
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
productSchema.index({ productName: "text", description: "text" }); // For text search

// Export the Product Model
module.exports = mongoose.model("Product", productSchema);
