import FeaturedCard from "./featuredCard";
import { useFetchSections } from "../utilities/useSectionFunctions";
import { useEffect, useState, useRef } from "react";
import useFetchTopProducts from "../utilities/useFetchTopProducts";

const FeaturedWindow = () => {
  // const featuredTags = [["men"], ["women"], ["Children"]];
  const [loading, products, getProducts] = useFetchTopProducts();
  const [chosenProducts, setChosenProducts] = useState([]);
  const [
    isFetchingSectionsLoading,
    sectionResults,
    setSectionResults,
    tryFetchSections,
  ] = useFetchSections();

  useEffect(() => {
    tryFetchSections();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      let tempProducts = [];
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
      setChosenProducts(tempProducts);
    };
    if (sectionResults) fetchProducts();
  }, [sectionResults]);

  useEffect(() => {
    console.log(chosenProducts);
  }, [chosenProducts]);

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
              />
            );
          })
        : null}
    </div>
  );
};

export default FeaturedWindow;
