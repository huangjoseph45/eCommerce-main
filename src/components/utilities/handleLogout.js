const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:2000/api/users/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Inititiated Logout");
    console.log("Response: ");
    console.log(response);
  } catch (error) {
    console.error("Error: " + error);
  }
};

export default handleLogout;
