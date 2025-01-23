const validatePassword = (password) => {
  console.log(password);
  return String(password)
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/);
};

export default validatePassword;
