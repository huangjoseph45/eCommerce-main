import isEmpty from "./isEmpty";

const updateServerData = async ({ userInfo }) => {
  if (isEmpty(userInfo) || isEmpty(userInfo.email)) {
    return false;
  }
  try {
    const response = await fetch("http://localhost:2000/api/users/update", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to fetch data from server:", error);
    throw error; // Re-throw the error to allow the caller to handle it
  }
};

export default updateServerData;
