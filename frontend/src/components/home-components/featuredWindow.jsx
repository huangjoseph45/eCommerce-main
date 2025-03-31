import FeaturedCard from "./featuredCard";
import { useFetchSections } from "../utilities/useSectionFunctions";
import { useEffect, useState } from "react";
const FeaturedWindow = () => {
  // const featuredTags = [["men"], ["women"], ["Children"]];
  const [
    isFetchingSectionsLoading,
    sectionResults,
    setSectionResults,
    tryFetchSections,
  ] = useFetchSections();

  useEffect(() => {
    tryFetchSections();
  }, []);

  return (
    <div
      className="w-screen h-fit py-6 sm:px-8 flex flex-row  overflow-x-scroll  snap-x snap-mandatory sm:gap-6 overflow-y-visible scrollbar-hide mx-auto"
      style={{ scrollBehavior: "auto" }}
    >
      {sectionResults
        ? sectionResults.map((section, index) => {
            return (
              <FeaturedCard
                key={section._id + section.slug}
                section={section}
                index={index}
              />
            );
          })
        : null}
    </div>
  );
};

export default FeaturedWindow;
