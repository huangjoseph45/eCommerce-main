const mongoose = require("mongoose");

// Define your schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 },
  numSales: { type: Number, default: 0 },
  address: { type: String, default: "" },
  totalBalance: { type: Number, default: 0 },
  loginHistory: {
    type: [Date],
    default: () => [new Date()],
  },
  createdAt: { type: Date, default: Date.now },
  cart: {
    type: Array,
  },
});

// Create and export the model
module.exports = mongoose.model("User", userSchema, "users");
