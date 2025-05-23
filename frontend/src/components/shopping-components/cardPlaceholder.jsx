const CardPlaceHolder = ({ showText = true }) => {
  return (
    <div
      className="rounded-sm w-full h-fit flex flex-col gap-1 px-2 cursor-pointer box-border pb-2 relative z-0
"
    >
      <div className="relative w-full select-none object-cover aspect-[4/5] rounded-md animate-pulseBg bg-bgBase3/30 opacity-30"></div>
      {showText ? (
        <>
          <p className="border font-semibold text-lg max-w-[9rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
          <p className="font-semibold text-lg max-w-[12rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
          <p className="font-semibold text-lg max-w-[17rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
          <p className="font-semibold text-lg max-w-[14rem] h-8 bg-gray-400 text-gray-400 rounded-full opacity-25  animate-pulseBg"></p>
        </>
      ) : null}
    </div>
  );
};

export default CardPlaceHolder;
