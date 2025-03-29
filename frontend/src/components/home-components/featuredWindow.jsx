import FeaturedCard from "./featuredCard";
const FeaturedWindow = () => {
  const featuredTags = [["men"], ["women"], ["new"], ["Children"]];

  return (
    <div
      className="w-screen h-fit p-12 px-24 flex flex-row  overflow-x-scroll  snap-x snap-mandatory sm:gap-6 overflow-y-visible scrollbar-hide mx-auto"
      style={{ scrollBehavior: "auto" }}
    >
      {featuredTags
        ? featuredTags.map((tagArray) => {
            return <FeaturedCard key={tagArray} tagArray={tagArray} />;
          })
        : null}
    </div>
  );
};

export default FeaturedWindow;
