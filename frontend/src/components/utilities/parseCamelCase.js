function parseCamelCase(text) {
  // Insert space before each uppercase letter
  let regularText = text.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Optionally, capitalize the first letter
  regularText = regularText.charAt(0).toUpperCase() + regularText.slice(1);
  return regularText;
}

export default parseCamelCase;
