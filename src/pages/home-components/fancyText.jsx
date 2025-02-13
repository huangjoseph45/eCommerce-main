import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure React Router is installed

const FancyText = ({ text }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const navigate = useNavigate();

  const animations = [
    "animate-rotateMove0",
    "animate-rotateMove1",
    "animate-rotateMove2",
    "animate-rotateMove3",
    "animate-rotateMove4",
  ];

  const reverseAnimations = [
    "animate-reverseRotateMove0",
    "animate-reverseRotateMove1",
    "animate-reverseRotateMove2",
    "animate-reverseRotateMove3",
    "animate-reverseRotateMove4",
  ];

  return (
    <h1
      className="cursor-pointer flex flex-row hover:text-bgTertiary transition-all duration-100"
      onClick={() => navigate("/new")}
      onMouseEnter={() => {
        setReverseAnimation(false);
        setShowAnimation(true);
      }}
      onAnimationEnd={() => setShowAnimation(false)}
    >
      {text.split("").map((char, index) => {
        const animation = animations[index % animations.length];
        const reverseAnimationClass =
          reverseAnimations[index % reverseAnimations.length];

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
                showAnimation
                  ? animation
                  : reverseAnimation
                  ? reverseAnimationClass
                  : ""
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
