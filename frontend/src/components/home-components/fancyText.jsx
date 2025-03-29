import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedText = ({ text, size = "large" }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const navigate = useNavigate();

  return (
    <h1
      className={`cursor-pointer flex flex-row hover:text-bgTertiary transition-all duration-100`}
      onClick={() => navigate("/new")}
      onAnimationEnd={() => setShowAnimation(false)}
    >
      {text.split("").map((char, index) => {
        if (char === " ")
          return (
            <div
              key={`space-${index}`}
              className={size === "large" ? "mx-2" : "mx-1"}
            ></div>
          );

        return (
          <motion.span
            key={`${char}-${index}`}
            initial={{ opacity: 0, scale: -1 }}
            animate={showAnimation ? { opacity: 1, scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 8,
              mass: 0.5,
              delay: index * 0.005, // Adds stagger effect
            }}
            className="inline-block select-none"
          >
            {char}
          </motion.span>
        );
      })}
    </h1>
  );
};

export default AnimatedText;
