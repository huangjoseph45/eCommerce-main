import FeaturedCard from "./featuredCard";
const FeaturedWindow = () => {
  const featuredTags = [["men"], ["women"], ["Children"]];

  return (
    <div
      className="w-screen h-fit py-6 sm:px-8 flex flex-row  overflow-x-scroll  snap-x snap-mandatory sm:gap-6 overflow-y-visible scrollbar-hide mx-auto"
      style={{ scrollBehavior: "auto" }}
    >
      {featuredTags
        ? featuredTags.map((tagArray, index) => {
            return (
              <FeaturedCard key={tagArray} tagArray={tagArray} index={index} />
            );
          })
        : null}
    </div>
  );
};

export default FeaturedWindow;
