import { useEffect, useState } from "react";
import isEmpty from "./isEmpty";

let count = 0;

const useUpdateServerData = ({ dataToUpdate = {} }) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  const handleUpdate = async (data) => {
    if (!data || isEmpty(data)) return;
    try {
      setLoading(true);
      console.log(data);
      const res = await fetch(`${import.meta.env.VITE_PATH}/users/update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) setErrorCode(await res.json());
      const cachedInfo = JSON.parse(sessionStorage.getItem("userInfo")) || null;

      console.log(cachedInfo);
      const updatedInfo = { ...cachedInfo, ...data };

      console.log(updatedInfo);
      sessionStorage.setItem(
        "userDetails",
        JSON.stringify({ ...cachedInfo, ...updatedInfo })
      );
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify({
          firstName: updatedInfo.firstName,
          cart: updatedInfo.cart,
        })
      );

      setResponse(res);
    } catch (error) {
      console.error("Failed to fetch data from server:", error);
      setErrorCode(error);
    }
  };

  useEffect(() => {
    if (dataToUpdate) {
      handleUpdate(dataToUpdate);
    }
    setLoading(false);
  }, []);

  return {
    isLoading,
    response,
    errorCode,
    setErrorCode,
    refetch: handleUpdate,
  };
};

const updateServerData = async ({ userInfo }) => {
  if (isEmpty(userInfo)) {
    return false;
  }
  try {
    console.log("UPDATE COUNT: " + count);

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

export default useUpdateServerData;
