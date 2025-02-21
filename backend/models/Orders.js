const mongoose = require("mongoose");

const productInfoSchema = new mongoose.Schema({
  paymentInfo: {
    currency: {
      type: String,
      required: true,
      enum: ["usd"],
    },
    unit_amount: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    set: (sku) => sku.trim().toLowerCase(),
  },
  quantity: {
    type: Number,
    min: 0,
    default: 1, // Optional: Set default quantity if not provided
  },
  size: {
    type: String,
    enum: {
      values: ["XS", "S", "M", "L", "XL", "XXL"],
      message: "{VALUE} is not a valid size",
    },
    trim: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    colorName: { type: String, required: true, trim: true },
    colorCode: { type: String, trim: true }, // Added trim for consistency
    idMod: { type: String, required: true, trim: true },
  },
});

const orderSchema = new mongoose.Schema(
  {
    productInfo: [productInfoSchema],

    shippingInfo: {
      name: {
        type: String,
        trim: true,
      },
      address: {
        line1: {
          type: String,
          trim: true,
          default: "",
        },
        city: {
          type: String,
          trim: true,
          default: "",
        },
        state: {
          type: String,
          trim: true,
          default: "",
        },
        country: {
          type: String,
          trim: true,
          default: "",
        },
      },
    },
    userInfo: {
      userId: { type: String, trim: true, required: true },
      email: { type: String, trim: true },
      phoneNumber: { type: String, trim: true, default: "" },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "unverified",
      enum: [
        "unverified",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "returned",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", orderSchema);
module.exports = { Orders };
