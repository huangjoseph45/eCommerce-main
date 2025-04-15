import FeaturedCard from "./featuredCard";
import { useFetchSections } from "../utilities/useSectionFunctions";
import { useEffect, useState, useRef } from "react";
import useFetchTopProducts from "../utilities/useFetchTopProducts";

const FeaturedWindow = () => {
  // const featuredTags = [["men"], ["women"], ["Children"]];
  const [loading, products, getProducts] = useFetchTopProducts();
  const [isHovering, setHovering] = useState(false);

  const [chosenProducts, setChosenProducts] = useState([]);
  const [
    isFetchingSectionsLoading,
    sectionResults,
    setSectionResults,
    tryFetchSections,
  ] = useFetchSections();

  useEffect(() => {
    const storedSections =
      JSON.parse(sessionStorage.getItem("sections")) || null;
    if (!storedSections) tryFetchSections();
    else {
      setSectionResults(storedSections);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      let tempProducts = [];
      const storedProducts =
        JSON.parse(sessionStorage.getItem("featuredSectionProducts")) || null;
      if (!storedProducts || storedProducts.length === 0) {
        for (const section of sectionResults) {
          let found = false;
          const fetchedProducts = await getProducts({
            enableTest: false,
            tagArray: section.tags,
            numProductsPerTag: sectionResults.length,
          });
          for (const product of fetchedProducts) {
            if (!found && !tempProducts.find((c) => c.sku === product.sku)) {
              found = true;
              tempProducts = [...tempProducts, product];
              break;
            }
          }
        }
        sessionStorage.setItem(
          "featuredSectionProducts",
          JSON.stringify(tempProducts)
        );
        setChosenProducts(tempProducts);
      } else {
        setChosenProducts(storedProducts);
      }
    };
    if (sectionResults) fetchProducts();
  }, [sectionResults]);

  return (
    <div
      className="w-screen h-fit py-6 sm:px-8 flex flex-row  overflow-x-scroll  snap-x snap-mandatory sm:gap-6 overflow-y-visible scrollbar-hide mx-auto"
      style={{ scrollBehavior: "auto" }}
    >
      {" "}
      {sectionResults
        ? sectionResults.map((section, index) => {
            return (
              <FeaturedCard
                key={section._id + section.slug}
                section={section}
                index={index}
                thisProduct={chosenProducts[index]}
                isHovering={isHovering}
                setHovering={setHovering}
              />
            );
          })
        : null}
    </div>
  );
};

export default FeaturedWindow;
