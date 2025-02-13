const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the Address Subschema
const addressSchema = new mongoose.Schema({
  country: { type: String, default: "United States" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "New Jersey" },
  zipCode: { type: String, default: "" },
});

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: Number,
      required: false,
      trim: true,
      match: [/^\d{10}$/, "Please fill a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    age: {
      type: Number,
      default: 18,
      min: [0, "Age cannot be negative"],
    },
    numSales: {
      type: Number,
      default: 0,
      min: [0, "Number of sales cannot be negative"],
    },
    orderHistory: {
      type: [String],
      default: [],
    },
    address: { type: addressSchema, default: () => ({}) },
    totalBalance: {
      type: Number,
      default: 0,
      min: [0, "Total balance cannot be negative"],
    },

    loginHistory: {
      type: [Date],
      default: () => [new Date()],
      validate: {
        validator: function (v) {
          return v.length <= 100; // Limit history to last 100 logins
        },
        message: "Login history exceeds the limit of 100",
      },
    },
    cart: {
      type: Array,
      default: [],
    },
    customerId: {
      type: String,
    },
    orders: {
      type: [String],
      default: [],
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    verifiedPhone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { phoneNumber: { $exists: true, $ne: null } },
  }
);

// Pre-save hook to hash passwords before saving
userSchema.pre("save", async function (next) {
  if (this.loginHistory.length > 100) {
    this.loginHistory = this.loginHistory.slice(-100); // Keep only the last 100 logins
  }
});

// Method to add a product to the cart
userSchema.methods.addToCart = async function (productId, quantity = 1) {
  const existingItemIndex = this.cart.findIndex((item) =>
    item.product.equals(productId)
  );

  if (existingItemIndex >= 0) {
    // If product already in cart, update quantity
    this.cart[existingItemIndex].quantity += quantity;
  } else {
    // If new product, add to cart
    this.cart.push({ product: productId, quantity });
  }

  return this.save();
};

// Method to remove a product from the cart
userSchema.methods.removeFromCart = async function (productId) {
  this.cart = this.cart.filter((item) => !item.product.equals(productId));
  return this.save();
};

// Method to clear the cart
userSchema.methods.clearCart = async function () {
  this.cart = [];
  return this.save();
};

// Export the User Model
module.exports = mongoose.model("User", userSchema);
