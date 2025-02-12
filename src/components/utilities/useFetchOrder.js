import { useState } from "react";

const useFetchOrder = () => {
  const [isLoading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  const fetchOrder = async (orderIdList) => {
    const path = `${import.meta.env.VITE_PATH}/stripe/order`;
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIdList }),
      });
      if (!response.ok) {
        console.error("Response not ok");
        setLoading(false);

        return;
      }

      let data = await response.json();
      data = data.orders.filter((item) => item !== null);
      setOrderData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error: " + error);
      setLoading(false);

      return;
    }
  };

  const handleFetch = (orderIdsList) => {
    fetchOrder(orderIdsList);
  };

  return [isLoading, orderData, handleFetch];
};

export default useFetchOrder;
