require("dotenv").config();

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
const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;
console.log(MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow any origin
    },
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(
  session({
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    name: "sessionId",
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 36, // 36 hours
      sameSite: "lax",
    },
  })
);

app.use("/api/stripe", paymentRoutes);
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);

app.use("/", (req, res) => {
  res.send("Welcome");
});

// Start server
const PORT = 2000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
