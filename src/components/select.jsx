import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";

const Select = ({ options, selectedValue, onSelect, field }) => {
  const [showElements, setShowElements] = useState(false);
  const list = useRef([]);
  list.current = useMemo(() => {
    return options.map((option) => option.name);
  }, [options]);

  const [query, setQuery] = useState(selectedValue);

  useEffect(() => {
    if (!list.current.includes(selectedValue)) {
      setQuery("");
    }
  }, [list.current]);

  const [filteredList, setFilteredList] = useState(list.current);

  const optionElements = useRef();

  const label =
    String(field.fieldName).charAt(0).toUpperCase() +
    String(field.fieldName).slice(1);

  const handleSelect = (value = null) => {
    if (
      !list.current.filter((listItem) => {
        return listItem.toLowerCase().localeCompare(query.toLowerCase() === 0);
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
    if (query !== "" && !list.current.includes(query)) {
      setFilteredList(
        list.current.filter((element) => {
          return element.toLowerCase().includes(query.toLowerCase());
        })
      );
    } else {
      setFilteredList(list.current);
    }
  }, [query, list.current]);

  useEffect(() => {
    optionElements.current = filteredList.map((option) => {
      return <SelectOption value={option} key={option} />;
    });
    if (optionElements.current.length === 0) {
      optionElements.current = (
        <SelectOption value={"No Results Found"} key={"NRF"} />
      );
    }
  }, [filteredList]);

  return (
    <>
      <label className="absolute top-0 left-[.9rem] bg-white px-1 text-xs flex gap-[0.1rem]">
        {label} {field.isRequired && <p className="text-red-600">*</p>}
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
            setQuery(selectedValue);
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
              className="absolute flex z-20 flex-col bg-white overflow-y-scroll h-fit max-h-[20rem] mt-4 p-2 w-full outline rounded-lg"
            >
              {optionElements.current}
            </motion.ul>
          )}{" "}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Select;
