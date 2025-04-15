import FeaturedWindow from "./featuredWindow";

const FeaturedSection = ({ elRef }) => {
  return (
    <div className="flex flex-col text-center my-2" ref={elRef}>
      <FeaturedWindow />
    </div>
  );
};

export default FeaturedSection;
