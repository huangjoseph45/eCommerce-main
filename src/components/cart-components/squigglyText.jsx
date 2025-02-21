const SquigglyText = ({ delay = "0s" }) => {
  return (
    <p
      className="w-full h-6 rounded-full bg-gray-500/30 border animate-pulseBg"
      style={{ animationDuration: delay }}
    ></p>
  );
};

export default SquigglyText;
