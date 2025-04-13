import { useState } from "react";

const useAddToMailing = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const addToMailing = async ({ email = null, phoneNumber = null }) => {
    if (!email && !phoneNumber) {
      setErrorMessage("Missing required fields");

      return;
    }
    setLoading(true);
    setErrorMessage();
    setIsSuccessful(false);

    try {
      const path = `${import.meta.env.VITE_PATH}/media/mailinglist-add`;
      const response = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      setIsSuccessful(true);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return { addToMailing, loading, errorMessage, isSuccessful };
};

export default useAddToMailing;
