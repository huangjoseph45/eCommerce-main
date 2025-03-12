module.exports = {
  env: {
    browser: true, // Allows global variables for the browser
    es2021: true, // Allows ECMAScript 2021 features
    node: true, // Allows Node.js global variables
  },
  extends: [
    "eslint:recommended", // Use ESLint's recommended rules
  ],
  parserOptions: {
    ecmaVersion: 12, // Use ECMAScript version 2021
    sourceType: "module", // Allows the use of ES modules
  },
  rules: {
    // You can add or customize rules here.
    indent: ["error", 2], // Enforces 2-space indentation
    "no-unused-vars": "warn", // Warns about unused variables
    quotes: ["error", "single"], // Enforces single quotes
    semi: ["error", "always"], // Enforces semicolons at the end of statements
  },
};
