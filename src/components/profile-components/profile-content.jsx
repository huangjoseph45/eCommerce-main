import { useContext, useEffect, useState, useMemo, useRef } from "react";
import {
  ProductContext,
  ShowProfileContext,
} from "../utilities/ContextManager";
import parseCamelCase from "../utilities/parseCamelCase";
import SaveButton from "../saveButton";
import PasswordField from "./password-field";
import Select from "../select";
import { Country, State, City } from "country-state-city";
import { AnimatePresence, motion } from "motion/react";

const ProfileContent = ({ currentSection, fieldData }) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);

  const [isChanged, setIsChanged] = useState(false);
  const { userInfo } = useContext(ProductContext);
  const [clonedInfo, setClonedInfo] = useState(structuredClone(userInfo));

  const countries = useRef(useMemo(() => Country.getAllCountries(), []));
  const [states, setStates] = useState(() => State.getAllStates());

  useEffect(() => {
    if (clonedInfo?.address?.country) {
      const country = countries.current.find(
        (elem) =>
          elem.name.toLowerCase() === clonedInfo.address.country.toLowerCase()
      );

      if (country && country.isoCode) {
        const newStates = State.getStatesOfCountry(country.isoCode);
        // Ensure a new array reference
        setStates([...newStates]);
      } else {
        console.warn(
          `Country code not found for "${clonedInfo.address.country}"`
        );
        setStates([]); // Optionally reset states if country not found
      }
    }
  }, [clonedInfo, countries.current]);

  useEffect(() => {
    setClonedInfo(structuredClone(userInfo));
    setIsChanged(false);
  }, [userInfo]);

  const editUserInfo = (e, field) => {
    const prefix = field.prefix;
    setClonedInfo({
      ...clonedInfo,
      ...(prefix
        ? {
            [prefix]: {
              ...clonedInfo[prefix],
              [field.fieldName]: e.target.value,
            },
          }
        : {
            [field.fieldName]: e.target.value,
          }),
    });

    setIsChanged(true);
  };

  const fields = fieldData.map((field) => {
    let regularText = field.fieldName;
    let textValue;
    if (field.isDate) {
      textValue = new Date(clonedInfo.creationDate).toDateString();
      regularText = parseCamelCase(field.fieldName);
    } else {
      regularText = parseCamelCase(field.fieldName);
      if (field.prefix)
        textValue = clonedInfo?.[field.prefix]?.[field.fieldName];
      else textValue = clonedInfo?.[field.fieldName];
    }

    return (
      <li
        key={field.fieldName}
        className="flex flex-row gap-3 p-2 items-center relative w-full"
      >
        {field.type !== "static" && field.fieldName !== "password" ? (
          field.fieldName === "country" ? (
            <Select
              options={countries.current}
              selectedValue={clonedInfo?.address?.country}
              onSelect={editUserInfo}
              field={field}
            />
          ) : field.fieldName === "state" ? (
            <Select
              options={states}
              selectedValue={clonedInfo.address?.state}
              onSelect={editUserInfo}
              field={field}
            />
          ) : (
            <>
              <label className="absolute top-0 left-[.9rem] bg-white px-1 text-xs flex gap-[0.1rem]">
                {regularText}{" "}
                {field.isRequired && <p className="text-red-600">*</p>}
              </label>
              <input
                type="text"
                defaultValue={textValue}
                className="outline outline-gray-600 p-3 rounded-lg w-full"
                onChange={(e) => editUserInfo(e, field)}
                maxLength={field.fieldName === "zipCode" ? 5 : 50}
              />
            </>
          )
        ) : field.type === "password" ? (
          <PasswordField />
        ) : (
          <div className="flex flex-col">
            <label
              htmlFor={field.fieldName}
              className="capitalize font-semibold"
            >
              {regularText}
            </label>
            <p className=" p-3 rounded-lg w-full" name={field.fieldName}>
              {textValue}
            </p>
          </div>
        )}
      </li>
    );
  });
  return (
    <div className="flex flex-col w-1/2 m-auto">
      {!showProfileHeaders && (
        <button
          className="absolute left-4  rounded-full p-2 hover:bg-gray-100 transition-all duration-200"
          onClick={() => setShowProfileHeaders(true)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="36px"
            height="36px"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M15.525 18.966L8.558 12l6.967-6.967"
            ></path>
          </svg>
        </button>
      )}
      <h1 className="text-2xl mb-6">{currentSection ? currentSection : ""}</h1>
      <ul className="flex flex-col gap-4  max-w-[25rem]"> {fields}</ul>
      <AnimatePresence>
        {isChanged && (
          <motion.div
            initial={{ opacity: 0.7, scale: 0.6, zIndex: 10 }}
            animate={{ opacity: 1, scale: 1, zIndex: 10 }}
            exit={{ opacity: 0.7, scale: 0 }}
            transition={{
              duration: 0.1, // Applies to initial and animate by default
            }}
            className="mt-4 w-fit mx-auto"
          >
            <SaveButton dataToSave={clonedInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileContent;
