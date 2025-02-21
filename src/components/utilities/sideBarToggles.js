import { useEffect } from "react";

const useSideBarToggle = ({
  setShowSidebar,
  isSearching = false,
  showSidebar,
}) => {
  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "scroll";
  }, [showSidebar]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Escape" && !isSearching) {
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
