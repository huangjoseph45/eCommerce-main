const CardPlaceHolder = () => {
  return (
    <div
      className="rounded-sm w-full h-fit flex flex-col gap-1 px-2 cursor-pointer box-border pb-2 relative z-0
"
    >
      <div className="relative w-full select-none object-cover aspect-[4/5] rounded-md opacity-25 animate-pulseBg"></div>

      <p className="font-semibold text-lg max-w-[12rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
      <p className="font-semibold text-lg max-w-[17rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
      <p className="font-semibold text-lg max-w-[14rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
      <div className="flex flex-row items-center gap-2">
        <p className="font-semibold text-lg max-w-[9rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
      </div>
    </div>
  );
};

export default CardPlaceHolder;
