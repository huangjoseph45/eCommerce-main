import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const FilterItem = ({
  filterName,
  filterFunc = null,
  filterId,
  type = "single",
  group = "sort",
  filter,
}) => {
  const [selectType, setSelectType] = useState(type);
  if (
    !selectType ||
    (selectType &&
      selectType.toLowerCase() !== "single" &&
      selectType.toLowerCase() !== "multi")
  )
    setSelectType("single");

  return (
    <li
      className="cursor-pointer flex items-center justify-between gap-1 px-2 p-1 w-full hover:bg-bgSecondary/15 rounded-sm"
      onClick={() => filterFunc({ group, filterId, type })}
    >
      <p className="text-base flex">{filterName}</p>

      <div
        className={`outline outline-bgExtraSecondaryLight aspect-square size-[0rem] flex items-center justify-center p-[0.4rem] ${
          type === "single" ? "rounded-full" : "rounded-sm"
        }`}
      >
        <AnimatePresence>
          {" "}
          {filter && filter[group] && filter[group][filterId] && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className={`bg-bgExtraSecondaryLight aspect-square flex items-center justify-center p-[.35rem] ${
                type === "single" ? "rounded-full" : "rounded-sm"
              }`}
            ></motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
};

export default FilterItem;
