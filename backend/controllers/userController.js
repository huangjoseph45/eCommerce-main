const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");

const User = require("../models/Users");
const {
  EncryptPassword,
  ComparePassword,
} = require("../models/encrypt-password");
const { request } = require("express");

/**
 * Helper function to validate required fields.
 */
const validateFields = (fields, res) => {
  for (const field of fields) {
    if (!field.value) {
      res.status(400).json({ error: `${field.name} is required` });
      return false;
    }
  }
  return true;
};

/**
 * Helper function to find a user by email.
 */
const findUserByEmail = async (email, res) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  return user;
};

/**
 * Helper function to create and save a session.
 */
const createSession = (req, res, user) => {
  if (!user || !user._id || !user.email) {
    console.error("Invalid user data provided for session creation.");
    return res.error({ status: 400, message: "Invalid user data" });
  }

  const sessionUser = {
    userId: user._id.toString(),
    email: user.email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  };
  req.session.user = sessionUser;
  console.log(req.session);

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.error({ status: 500, message: "Session save failed" });
    }
  });
  return res.send(req.session.user);
};

/**
 * Handler to check user credentials and log in.
 */
const checkUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (
      !validateFields(
        [
          { name: "email", value: email },
          { name: "password", value: password },
        ],
        res
      )
    )
      return;

    // Find user by email
    const user = await findUserByEmail(email, res);
    if (!user) return;

    // Compare passwords
    const isMatch = await ComparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const updateResult = await User.updateOne(
      { email },
      {
        $push: {
          loginHistory: {
            $each: [new Date()],
            $slice: -50, // Keeps only the last 10 entries
          },
        },
      },
      {
        runValidators: true, // Validate before updating
      }
    );

    if (updateResult.nModified === 0) {
      // Handle case where no documents were modified (e.g., user not found)
      throw new Error("User not found or loginHistory not updated");
    }

    // Create and save session
    createSession(req, res, user);
  } catch (error) {
    console.error("Error in checkUser:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Handler to register a new user.
 */
const newUser = async (req, res) => {
  try {
    const { email, password, cart } = req.body;

    // Validate required fields
    if (
      !validateFields(
        [
          { name: "email", value: email },
          { name: "password", value: password },
        ],
        res
      )
    )
      return;

    // Check if user already exists
    const existingUser = await findUserByEmail(email, res);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Encrypt password and create new user
    const hashedPassword = await EncryptPassword(password);
    const new_user = await User.create({
      email,
      password: hashedPassword,
    });

    // Create and save session
    createSession(req, res, new_user);
  } catch (error) {
    console.error("Error in newUser:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred",
    });
  }
};

/**
 * Handler to set user data.
 */
const setData = async (req, res) => {
  try {
    const { userId, email } = req.session.user;

    // Validate session data
    if (!validateFields([{ name: "email", value: email }], res)) return;

    // Find user and verify session
    const user = await User.findOne({ email });
    if (!user || user._id.toString() !== userId) {
      req.session.destroy();
      return res.status(400).json({ error: "Invalid sessionId" });
    }

    // Regenerate session
    req.session.user.ip = req.ip;
    req.session.user.userAgent = req.get("User-Agent");

    // Respond with user data
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      age: user.age,
      email: user.email,
      cart: user.cart,
      creationDate: user.createdAt,
      balance: user.totalBalance,
      address: user.address,
    });
  } catch (error) {
    console.error(`Error in setData: ${error.message}`, error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Handler to destroy session/logout
 */

const handleLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }

      // Redirect to the login page or homepage after logout
      res.status(200).redirect("/");
    });
  } catch (error) {
    console.error(`Error in setData: ${error.message}`, error);
    return res.status(500).json({ error: error.message });
  }
};

const handleDataUpdate = async (req, res) => {
  try {
    const { firstName, lastName, email, cart, age } = req.body;
    const update = {
      firstName,
      lastName,
      email,
      cart,
      age,
    };
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: update },
      { new: true, runValidators: true, upsert: false }
    );
    return res.status(200).json({
      message: "User successfully updated",
    });
  } catch (error) {
    console.error(`Error in setData: ${error.message}`, error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Middleware to verify user session.
 */
const verifySession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = {
  checkUser,
  newUser,
  setData,
  verifySession,
  handleLogout,
  handleDataUpdate,
};
