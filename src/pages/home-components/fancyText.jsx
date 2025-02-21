import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure React Router is installed

const FancyText = ({ text }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();
  useEffect(() => setShowAnimation(true), []);

  const animations = [
    "animate-rotateMove0",
    "animate-rotateMove1",
    "animate-rotateMove2",
    "animate-rotateMove3",
    "animate-rotateMove4",
    "animate-rotateMove5",
  ];

  return (
    <h1
      className="cursor-pointer flex flex-row hover:text-bgTertiary transition-all duration-100"
      onClick={() => navigate("/new")}
      onAnimationEnd={() => setShowAnimation(false)}
    >
      {text.split("").map((char, index) => {
        const animation = animations[index % animations.length];

        if (char === " ")
          return (
            <span key={`space-${index}`} className="mx-2">
              {" "}
            </span>
          );
        else
          return (
            <span
              key={`${char}-${index}`}
              className={`inline-block transition-all duration-300 ${
                showAnimation ? animation : ""
              } select-none`}
            >
              {char}
            </span>
          );
      })}
    </h1>
  );
};

export default FancyText;
