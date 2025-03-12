const isLoggedIn = () => {
  //extremely primitive script to check if logged in. Used to conditionally display front end elements
  const cookies = document.cookie;
  console.log(document.cookie);
  const loggedIn = cookies.includes("sessionId");

  return loggedIn;
};

export default isLoggedIn;
