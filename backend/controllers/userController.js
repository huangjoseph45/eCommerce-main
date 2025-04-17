const MONGO_URI = process.env.MONGO_URI;
const { default: mongoose } = require("mongoose");

const User = require("../models/Users");
const {
  EncryptPassword,
  ComparePassword,
} = require("../models/encrypt-password");

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
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return null;
  }
  return user;
};

/**
 * Helper function to create and save a session.
 */
const createSession = ({ req, res, user, remember = false }) => {
  if (!user || !user.email) {
    console.error("Invalid user data provided for session creation.");
    return res.status(400).json({ status: 400, message: "Invalid user data" });
  }
  const role = user.role || "customer";

  const sessionUser = {
    userId: user._id.toString(),
    email: user.email,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    role,
  };

  req.session.user = sessionUser;

  if (remember) {
    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
  } else if (role === "customer") {
    req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.maxAge = 2 * 60 * 60 * 1000;
  }

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Session save failed" });
    }
  });
  return res.send(req.session.user);
};

/**
 * Handler to check user credentials and log in.
 */
const checkUser = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    console.log("LOGIN ATTEMPT");
    console.log("EMAIL: " + email);
    console.log("PASSWORD: " + password);
    console.log("REMEMBER: " + remember);
    console.log("IP: " + req.ip);

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
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

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
    createSession({ req, res, user, remember });
  } catch (error) {
    console.error("Error in checkUser:", error);
    return res.status(500).json({ error: error.message });
  }
};

const checkUserStatus = async (req, res) => {
  try {
    if (req?.session?.user) {
      return res.status(200).send({
        hasSession: true,
        msg: "User found.",
        role: req.session.user.role,
      });
    } else {
      return res
        .status(200)
        .send({ msg: "No session started.", hasSession: false });
    }
  } catch (error) {
    console.error("Error checking user session:", error);
    return res.status(500).send({ msg: "Server error", hasSession: false });
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

    createSession({ req, res, user: new_user, remember: false });
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
const fetchData = async (req, res) => {
  try {
    const { userId, email } = req.session.user;

    const queries = req.body || null;
    // Validate session data
    if (!validateFields([{ name: "email", value: email }], res)) return;
    const user = await User.findOne(
      { email },
      "email firstName lastName age cart createdAt totalBalance address phoneNumber orders verifiedEmail verifiedPhone"
    );
    if (!user || user._id.toString() !== userId) {
      req.session.destroy();
      return res.status(401).json({ error: "Unauthorized: Invalid session" });
    }

    // Regenerate session
    req.session.user.ip = req.ip;
    req.session.user.userAgent = req.get("User-Agent");
    const validQueries = [
      "email",
      "firstName",
      "lastName",
      "age",
      "cart",
      "createdAt",
      "balance",
      "address",
      "phoneNumber",
      "orders",
      "verifiedEmail",
      "verifiedPhone",
      "_id",
    ];

    let matched;
    if (queries && Array.isArray(queries) && queries.length > 0) {
      const validMatchedQueries = queries.filter((query) =>
        validQueries.includes(query)
      );

      matched = validMatchedQueries.reduce((acc, query) => {
        acc[query] = user[query === "balance" ? "totalBalance" : query];
        return acc;
      }, {});
    } else {
      matched = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        cart: user.cart,
        createdAt: user.createdAt,
        balance: user.totalBalance,
        address: user.address,
        phoneNumber: user.phoneNumber,
        orders: user.orders,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
      };
    }
    return res.status(200).json(matched);
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
        return res.status(500).json({ message: "Unable to logout" });
      }
      res.clearCookie("sessionId", {
        path: "/", // Path must match your session cookie path
      });

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
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Empty Package" });
    }

    const { email, firstName, lastName, cart, age, address, phoneNumber } =
      req.body;

    if (address?.zipCode && String(address.zipCode).length !== 5) {
      return res.status(400).json({ message: "Zipcode Invalid" });
    }

    const id = req.session.user.userId;

    if (!id || id === "") {
      return res.status(400).json({ message: "User could not be verified" });
    }

    const update = {
      ...(email !== undefined && { email }),

      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(cart !== undefined && { cart }),
      ...(age !== undefined && { age }),
      ...(address !== undefined && { address }),
      ...(phoneNumber !== undefined && { phoneNumber }),
    };

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true, runValidators: true, upsert: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User successfully updated",
    });
  } catch (error) {
    console.error(`Error in setData: ${error.message}`, error);
    return res.status(500).json({ error: error.message });
  }
};

const updateSensitiveData = async (req, res) => {
  const {
    oldEmail = "",
    email = "",
    oldPassword = "",
    password = "",
  } = req.body;
  if (email || oldEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
  }

  const userId = req.session.user.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Invalid user ID." });
  }

  const foundUser = await User.findById(userId).select("+password");

  if (email && oldEmail) {
    const isEmailValid = foundUser.email.localeCompare(email) === 0;

    if (!isEmailValid) {
      return res.status(403).json({ message: "Invalid email" });
    }
    await User.updateOne(
      { _id: userId },
      { $set: { email: email } },
      { runValidators: true }
    );
  } else if (email) {
    return res.status(402).json({ message: "Invalid Email" });
  }

  if (password && oldPassword) {
    const isPasswordValid = await ComparePassword(
      oldPassword,
      foundUser.password
    );

    if (password.localeCompare(oldPassword) === 0) {
      return res.status(402).json({ message: "Must supply new password" });
    }
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password" });
    }

    const hashedPassword = await EncryptPassword(password);

    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { runValidators: true }
    );
  } else if (password) {
    return res.status(402).json({ message: "Invalid password" });
  }

  return res
    .status(200)
    .json({ message: "Sensitive Data Has Been Updated", password: password });
};

/**
 * Middleware to verify user session.
 */

module.exports = {
  checkUser,
  newUser,
  fetchData,
  handleLogout,
  handleDataUpdate,
  updateSensitiveData,
  checkUserStatus,
};
