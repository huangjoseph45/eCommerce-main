require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

// Import Routes
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const contentRoutes = require("../routes/contentRoutes");

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;

// Connect to MongoDB (Ensure it's async to prevent timeouts)
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    name: "sessionId",
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 36 },
  })
);

// Routes
app.use("/api/stripe", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Serverless API!");
});

// Export the serverless function
module.exports = app;
