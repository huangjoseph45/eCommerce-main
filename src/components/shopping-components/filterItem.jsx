import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
      {filter && filter[group] && filter[group][filterId] && (
        <p>
          <FontAwesomeIcon icon={faCheck} />
        </p>
      )}
    </li>
  );
};

export default FilterItem;
