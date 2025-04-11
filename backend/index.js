const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors"); // Import the CORS middleware
const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js");
const contentRoutes = require("./routes/contentRoutes.js");

const app = express();
app.set("trust proxy", 1);

const MONGO_URI = process.env.MONGO_URI;
const SESSION_SALT_SECRET = process.env.SECRET;
const PROD = process.env.PROD?.toLowerCase() === "true";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: process.env.VITE_CLIENT_PATH,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.set("trust proxy", 1);

app.use(
  session({
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    name: "sessionId",
    secret: SESSION_SALT_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      domain: PROD ? "imagine-collective.tech" : "",
      sameSite: PROD ? "none" : false,
      secure: PROD,
      maxAge: 1000 * 60 * 60 * 36, // 36 hours
      httpOnly: true,
    },
  })
);
app.set("trust proxy", true);
app.use("/api/stripe", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);

app.use("/", (req, res) => {
  res.send("Welcome");
});

// Start server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
  console.log(PORT);
});
