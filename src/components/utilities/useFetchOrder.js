import { useState } from "react";

const useFetchOrder = () => {
  const [isLoading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchOrder = async (id) => {
    const path = `${import.meta.env.VITE_PATH}/order/${id}`;
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.error("Response not ok");
        return;
      }

      const data = await response.json();
      setOrderData(data.order);
    } catch (error) {
      console.error("Error: " + error);
      return;
    }
  };

  const handleFetch = (id) => {
    fetchOrder(id);
    setLoading(false);
  };

  return [isLoading, orderData, handleFetch];
};

export default useFetchOrder;
