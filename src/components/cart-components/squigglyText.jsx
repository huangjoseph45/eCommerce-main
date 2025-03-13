const SquigglyText = ({ delay = "0s" }) => {
  return (
    <p
      className="w-full min-h-[1rem] h-full rounded-xl bg-gray-500/30 animate-pulseBg min-w-[4rem] opacity-55"
      style={{ animationDuration: delay }}
    ></p>
  );
};

export default SquigglyText;
