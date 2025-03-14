const doesExist = (itemToCheck) => {
  if (itemToCheck !== null && itemToCheck !== undefined) return true;
  return false;
};

export default doesExist;
