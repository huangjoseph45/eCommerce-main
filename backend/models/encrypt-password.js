const bcrypt = require("bcryptjs");

/**
 * EncryptPassword - returns a hashed version of the provided password.
 * @param {String} password - The raw password to be hashed.
 * @return {Promise<String>} - The password hash.
 */
const EncryptPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password provided");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Cannot encrypt password:", error);
    throw new Error("Password encryption failed");
  }
};

const ComparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error("Invalid inputs for password comparison");
  }

  try {
    const comparison = await bcrypt.compare(password, hashedPassword);

    console.log(comparison);
    return comparison;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

module.exports = {
  EncryptPassword,
  ComparePassword,
};
