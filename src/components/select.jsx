import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import isEmpty from "./utilities/isEmpty";

const Select = ({ options, selectedValue, onSelect, field }) => {
  const [showElements, setShowElements] = useState(false);
  const list = useRef([]);
  console.log(options);
  list.current = useMemo(() => {
    return options.map((option) => option.name);
  }, [options]);

  const [query, setQuery] = useState(
    list.current.includes(selectedValue) ? selectedValue : ""
  );

  useEffect(() => {
    if (!list.current.includes(selectedValue)) {
      setQuery("");
    }
  }, [list.current]);

  const [filteredList, setFilteredList] = useState(list.current);

  const [optionElements, setOptionElements] = useState([]);

  const label =
    String(field.fieldName).charAt(0).toUpperCase() +
    String(field.fieldName).slice(1);

  const handleSelect = (value = null) => {
    if (
      !list.current.filter((listItem) => {
        return listItem?.toLowerCase().localeCompare(query.toLowerCase() === 0);
      }).length > 0
    ) {
      return;
    }
    const e = {
      target: {
        value: value ? value : query,
      },
    };
    onSelect(e, field);
    setQuery(value ? value : query);
  };

  const changeInput = (e) => {
    const currentInput = e.target.value;
    setQuery(currentInput);
  };

  const SelectOption = ({ value }) => {
    return (
      <li
        className={`hover:outline outline-blue-400 p-3 rounded-md w-full ${
          selectedValue === value && "bg-blue-200"
        }`}
        onClick={() => handleSelect(value)}
        role="option"
        aria-selected="false"
      >
        {value}
      </li>
    );
  };

  useEffect(() => {
    if (
      !isEmpty(query) &&
      !list.current.includes(query) &&
      !isEmpty(list.current)
    ) {
      setFilteredList(
        list.current.filter((element) => {
          if (typeof element !== "string") {
            console.warn("Encountered a non-string element:", element);
            return false;
          }

          if (typeof query !== "string") {
            console.warn("Encountered a non-string element:", query);
            return false;
          }
          console.log(query);
          return element.toLowerCase().includes(query.toLowerCase());
        })
      );
    } else {
      setFilteredList(list.current);
    }
  }, [query, list.current]);

  useEffect(() => {
    if (filteredList.length > 0) {
      setOptionElements(
        filteredList.map((option) => (
          <SelectOption value={option} key={option} />
        ))
      );
    } else {
      setOptionElements([
        <SelectOption value="No Results Found" key="NRF" disabled />,
      ]);
    }
  }, [filteredList]);

  return (
    <>
      <label className="absolute top-0 left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem]">
        {label} {field.isRequired && <p className="text-errorTrue">*</p>}
      </label>
      <div className=" rounded-lg w-full cursor-pointer">
        <input
          type="text"
          autoCapitalize="on"
          name="stop auto complete"
          autoComplete="new-password"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowElements(false);
              document.activeElement.blur();
            }
          }}
          value={query}
          onFocus={() => setShowElements(true)}
          onBlur={() => {
            setShowElements(false);
            setQuery(list.current.includes(selectedValue) ? selectedValue : "");
            if (
              list.current.filter((listItem) => {
                return (
                  listItem.toLowerCase().localeCompare(query.toLowerCase()) ===
                  0
                );
              }).length > 0
            )
              handleSelect(query);
          }}
          onChange={(e) => changeInput(e)}
          className="outline outline-gray-600 p-3 rounded-lg w-full cursor-pointe"
        />

        <AnimatePresence>
          {showElements && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute flex z-20 flex-col bg-bgBase overflow-y-scroll h-fit max-h-[20rem] mt-4 p-2 w-full outline rounded-lg"
            >
              {optionElements}
            </motion.ul>
          )}{" "}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Select;
