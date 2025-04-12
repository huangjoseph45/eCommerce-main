import { useState } from "react";

const useUpdateSEO = () => {
  const [loading, setLoading] = useState(false);

  const updateSEO = async ({ sku, SEOValue }) => {
    if (!sku || !SEOValue || SEOValue < 1) return;
    setLoading(true);
    try {
      const fetchURL = `${
        import.meta.env.VITE_PATH
      }/products/update-seo/${sku}/${SEOValue}`;
      const response = await fetch(fetchURL, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const msg = await response.json();
        console.error(msg);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  return [loading, updateSEO];
};

export default useUpdateSEO;
