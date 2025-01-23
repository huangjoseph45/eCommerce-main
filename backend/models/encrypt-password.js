const bcrypt = require("bcryptjs");

/**
 * EncryptPassword - returns a hashed version of the provided password.
 * @param {String} password - The raw password to be hashed.
 * @return {Promise<String>} - The password hash.
 */
const EncryptPassword = async (password) => {
  try {
    // 1. Generate salt
    const salt = await bcrypt.genSalt(10);

    // 2. Hash password using the generated salt
    const hash = await bcrypt.hash(password, salt);

    // 3. Return the hashed password
    return hash;
  } catch (error) {
    console.error("Cannot encrypt password:", error);
    // You can decide what to return or throw in case of error
    throw new Error("Password encryption failed");
  }
};

const ComparePassword = async (password, hashedPassword) => {
  const comparison = await bcrypt.compare(password, hashedPassword);

  return comparison;
};

module.exports = {
  EncryptPassword,
  ComparePassword,
};
