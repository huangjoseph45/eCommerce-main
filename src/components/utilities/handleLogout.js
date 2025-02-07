const handleLogout = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_PATH}/users/logout`, {
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
