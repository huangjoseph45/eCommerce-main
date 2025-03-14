import { useEffect, useRef, useState } from "react";
import useSideBarToggle from "../utilities/sideBarToggles";
import { AnimatePresence, motion } from "motion/react";
import FilterItem from "./filterItem";
import { createPortal } from "react-dom";

const Filter = ({ sortingInfo, setSortingInfo }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [filter, setFilter] = useState(null);
  useSideBarToggle({
    setShowSidebar: setShowFilters,
    showSidebar: showFilters,
  });

  useEffect(() => {
    if (!filter) {
      setFilter({
        sort: {
          newest: true,
          lowToHigh: false,
          highToLow: false,
        },
        prices: {
          "0-25": true,
          "25-50": true,
          "50-100": true,
          "100+": true,
        },
      });
    }
    const resizedWindow = () => {
      if (window.innerWidth > 1024) {
        setShowFilters(true);
        setShowFilterButton(false);
      } else {
        setShowFilterButton(true);
        setShowFilters(false);
      }
    };

    resizedWindow();

    window.addEventListener("resize", resizedWindow);

    return () => window.removeEventListener("resize", resizedWindow);
  }, []);

  const filterFunc = ({ group, filterId, type }) => {
    if (group && filterId) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        [group]: Object.fromEntries(
          Object.keys(prevFilter[group] || {}).map((key) => [
            key,
            type === "multi"
              ? key === filterId
                ? !prevFilter[group]?.[key]
                : prevFilter[group]?.[key]
              : key === filterId,
          ])
        ),
      }));
    }
  };

  useEffect(() => {
    if (
      (!showFilters || !showFilterButton) &&
      filter &&
      filter !== sortingInfo
    ) {
      setSortingInfo(filter);
    }
  }, [showFilters, filter]);

  return (
    <div className="lg:sticky lg:top-[4rem]">
      {showFilterButton && (
        <button
          className="flex gap-1 cursor-pointer py-1 border rounded-full shadow-md focus:outline focus:outline-black hover:bg-bgBlack/15 transition-all duration-200 px-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
          <div className="">{FilterSVG}</div>
        </button>
      )}
      <AnimatePresence>
        {showFilters && (
          <>
            {showFilterButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                }}
                className="fixed h-[200vh] w-[100vw] min-w-[20rem] bg-bgBlack/35 left-0 top-0 z-50 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              ></motion.div>
            )}

            <motion.div
              initial={showFilterButton ? { x: "100%" } : {}}
              animate={{ x: showFilterButton ? "4rem" : 0 }}
              exit={showFilterButton ? { x: "100%" } : {}}
              transition={{
                duration: 0.1,
                type: "spring",
                stiffness: 500,
                damping: 20,
                mass: 0.5,
              }}
              className={`${
                showFilterButton
                  ? "min-w-[20rem] right-0 z-50 p-4 h-[100vh] fixed top-0 pr-[4.5rem]"
                  : " w-[12rem] left-0  h-fit"
              } bg-bgBase py-8 flex flex-col gap-6 `}
            >
              {showFilterButton && (
                <>
                  {" "}
                  <div
                    className={`top-6 text-textDark cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2 rounded-full transition-all duration-300 absolute right-16 flex aspect-square w-fit z-[100]`}
                    title={"Close"}
                    onClick={() => {
                      setShowFilters(!showFilters);
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      viewBox="0 0 24 24"
                      role="img"
                      width="24px"
                      height="24px"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
                      ></path>
                    </svg>
                  </div>
                  <h1 className="text-2xl">Filter</h1>
                </>
              )}

              <div className="flex flex-col">
                <h2 className="text-xl border-b-2 mb-2 w-4/5">Sort By</h2>
                <ul className="mb-6 flex flex-col items-start justify-center w-full gap-1">
                  <FilterItem
                    filterName="Newest"
                    filterFunc={filterFunc}
                    type="single"
                    group="sort"
                    filterId={"newest"}
                    filter={filter}
                  />
                  <FilterItem
                    filterName="Price: High to Low"
                    filterFunc={filterFunc}
                    type="single"
                    group="sort"
                    filterId={"highToLow"}
                    filter={filter}
                  />
                  <FilterItem
                    filterName="Price: Low to High"
                    filterFunc={filterFunc}
                    type="single"
                    group="sort"
                    filterId={"lowToHigh"}
                    filter={filter}
                  />
                </ul>
                <h2 className="text-xl border-b-2 mb-2 w-4/5">Price</h2>
                <ul className="mb-6 flex flex-col items-start justify-center w-full gap-1">
                  <FilterItem
                    filterName="$0 - $25"
                    filterFunc={filterFunc}
                    type="multi"
                    group="prices"
                    filterId={"0-25"}
                    filter={filter}
                  />
                  <FilterItem
                    filterName="$25 - $50"
                    filterFunc={filterFunc}
                    type="multi"
                    group="prices"
                    filterId={"25-50"}
                    filter={filter}
                  />
                  <FilterItem
                    filterName="$50 - $100"
                    filterFunc={filterFunc}
                    type="multi"
                    group="prices"
                    filterId={"50-100"}
                    filter={filter}
                  />
                  <FilterItem
                    filterName="$100+"
                    filterFunc={filterFunc}
                    type="multi"
                    group="prices"
                    filterId={"100+"}
                    filter={filter}
                  />
                </ul>
              </div>
            </motion.div>
          </>
        )}{" "}
      </AnimatePresence>
    </div>
  );
};

export default Filter;

const FilterSVG = (
  <svg
    aria-hidden="true"
    className="icon-filter-ds"
    focusable="false"
    viewBox="0 0 24 24"
    role="img"
    width="24px"
    height="24px"
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M21 8.25H10m-5.25 0H3"
    ></path>
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
      clipRule="evenodd"
    ></path>
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M3 15.75h10.75m5 0H21"
    ></path>
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
      clipRule="evenodd"
    ></path>
  </svg>
);
