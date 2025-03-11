import { useEffect } from "react";

const useSideBarToggle = ({
  setShowSidebar,
  isSearching = false,
  showSidebar,
}) => {
  useEffect(() => {
    const resizeFunc = () => {
      if (window.innerWidth > 1024) {
        document.body.style.overflow = "scroll";
      } else {
        document.body.style.overflow = showSidebar ? "hidden" : "scroll";
      }
    };

    resizeFunc();

    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, [showSidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Escape" && !isSearching && window.innerWidth < 1024) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
};

export default useSideBarToggle;
