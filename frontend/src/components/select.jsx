import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import isEmpty from "./utilities/isEmpty";

const Select = ({ options, selectedValue, onSelect, field }) => {
  const [showElements, setShowElements] = useState(false);
  const list = useRef([]);
  const containerRef = useRef(null);

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
    setShowElements(false);

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
        tabIndex={0}
        onClick={() => {
          handleSelect(value);
        }}
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
      <label className="absolute -top-2 left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem] text-textHollow">
        {label} {field.isRequired && <p className="text-errorTrue">*</p>}
      </label>
      <div
        className=" rounded-lg w-full cursor-pointer"
        ref={containerRef}
        onBlur={(event) => {
          if (containerRef.current.contains(event.relatedTarget)) {
            return;
          }

          setQuery(list.current.includes(selectedValue) ? selectedValue : "");
          if (
            list.current.filter((listItem) => {
              return (
                listItem.toLowerCase().localeCompare(query.toLowerCase()) === 0
              );
            }).length > 0
          ) {
            handleSelect(query);
          }
          setShowElements(false);
        }}
      >
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
          onChange={(e) => changeInput(e)}
          className="outline outline-textHollow p-3 rounded-md w-full cursor-pointer bg-bgBase"
        />

        <AnimatePresence>
          {showElements && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ maxHeight: "20rem", height: "fit-content" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute flex z-20 flex-col bg-bgBase overflow-y-scroll mt-2 p-2 w-full outline rounded-lg"
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
