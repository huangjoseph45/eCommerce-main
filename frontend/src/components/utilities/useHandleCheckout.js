import { useState } from "react";

const useHandleCheckout = () => {
  const checkoutLink = `${import.meta.env.VITE_PATH}/stripe/checkout`;
  const [isLoading, setLoading] = useState(false);

  const handleCheckout = async (products) => {
    try {
      setLoading(true);
      const response = await fetch(checkoutLink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products, seoValue: 10 }),
      });

      if (!response.ok) {
        console.log(response);
        return;
      }

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Error: " + error);
      return;
    }
  };

  const initiateCheckout = async (products) => {
    console.log(products);
    const res = await handleCheckout(products);
    setLoading(false);
  };

  return [isLoading, initiateCheckout];
};

export default useHandleCheckout;
