import { useEffect } from "react";

const useDynamicComponent = ({ setVisible, desktop = false }) => {
  useEffect(() => {
    const checkEscape = (e) => {
      if (e.key === "Escape") {
        if (!desktop) setVisible(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisible(false);
      }
    };

    window.addEventListener("keydown", checkEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", checkEscape);

      window.removeEventListener("resize", handleResize);
    };
  }, []);
};

export default useDynamicComponent;
