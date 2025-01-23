const mongoose = require("mongoose");

// Define your schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, default: "", required: true },
  lastName: { type: String, default: "", required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 },
  numSales: { type: Number, default: 0 },
  address: { type: String, default: "" },
  totalBalance: { type: Number, default: 0 },
  loginHistory: {
    type: Array,
    default: [Date.now],
  },
  createdAt: { type: Date, default: Date.now },
  cart: {
    type: Array,
    default: [],
  },
});

// Create and export the model
module.exports = mongoose.model("User", userSchema, "users");
