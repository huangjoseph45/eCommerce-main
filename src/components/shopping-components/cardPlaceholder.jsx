const CardPlaceHolder = () => {
  return (
    <div
      className="rounded-sm w-full h-fit flex flex-col gap-1 px-2 cursor-pointer box-border pb-2 relative z-0
"
    >
      <div className="relative">
        <img className="h-[14rem] sm:[18rem] md:[22rem] lg:h-[24rem] w-[25rem] select-none bg-slate-400 rounded-md opacity-25 animate-pulseBg" />
      </div>

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
