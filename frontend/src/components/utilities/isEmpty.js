const isEmpty = (itemToCheck) => {
  if (
    itemToCheck === null ||
    itemToCheck === undefined ||
    itemToCheck === "" ||
    itemToCheck === "undefined"
  ) {
    return true;
  }

  // Check for empty array
  if (Array.isArray(itemToCheck) && itemToCheck.length === 0) {
    return true;
  }

  // Check for empty object
  if (
    typeof itemToCheck === "object" &&
    !Array.isArray(itemToCheck) &&
    Object.keys(itemToCheck).length === 0
  ) {
    return true;
  }

  return false;
};

export default isEmpty;
