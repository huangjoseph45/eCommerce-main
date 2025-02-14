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
import OrderHistory from "./order-history";
import VerifiedTag from "./verifiedTag";

const ProfileContent = ({
  currentSection,
  fieldData,
  fetchedUserData,
  isLoading,
}) => {
  const { showProfileHeaders, setShowProfileHeaders } =
    useContext(ShowProfileContext);

  const [isChanged, setIsChanged] = useState(false);
  const [clonedInfo, setClonedInfo] = useState(fetchedUserData);
  const [alteredData, setAlteredData] = useState({});

  console.log(clonedInfo);

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
    setClonedInfo(fetchedUserData);
  }, [fetchedUserData]);

  const saveFunc = () => {
    setIsChanged(false);
  };

  const editfetchedUserData = (e, field) => {
    const prefix = field.prefix;

    setAlteredData({
      ...alteredData,
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
    if (field && field.isDate) {
      textValue = new Date(clonedInfo?.createdAt).toDateString();
      regularText = parseCamelCase(field.fieldName);
    } else {
      regularText = parseCamelCase(field.fieldName);
      if (field.prefix)
        textValue = clonedInfo?.[field.prefix]?.[field.fieldName];
      else textValue = clonedInfo?.[field.fieldName];
    }

    if (field.fieldName === "country") {
      return (
        <li
          key={field.fieldName}
          className="flex flex-row gap-3 items-center relative w-full"
        >
          <Select
            options={countries.current}
            selectedValue={clonedInfo?.address?.country}
            onSelect={editfetchedUserData}
            field={field}
          />
        </li>
      );
    }

    if (field.fieldName === "state") {
      return (
        <li
          key={field.fieldName}
          className="flex flex-row gap-3 p items-center relative w-full"
        >
          <Select
            options={states}
            selectedValue={clonedInfo?.address?.state}
            onSelect={editfetchedUserData}
            field={field}
          />
        </li>
      );
    }

    if (field.type === "password") {
      return (
        <li
          key={field.fieldName}
          className="flex flex-row gap-3 items-center relative w-full"
        >
          <PasswordField />
        </li>
      );
    }

    if (field.type === "input") {
      return (
        <li
          key={field.fieldName}
          className="flex flex-row gap-3 items-center relative w-full"
        >
          {((field.fieldName === "email" && !clonedInfo?.verifiedEmail) ||
            (field.fieldName === "phoneNumber" &&
              field.label &&
              !clonedInfo?.verifiedPhone)) && (
            <VerifiedTag tagName={field.label || field.fieldName} />
          )}

          <label className="absolute -top-2 left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem]">
            {regularText}
            {field.isRequired && <p className="text-errorTrue">*</p>}
          </label>
          <input
            type="text"
            defaultValue={textValue}
            className="outline outline-gray-600 p-3 rounded-lg w-full bg-bgBase"
            onChange={(e) => editfetchedUserData(e, field)}
            maxLength={field.fieldName === "zipCode" ? 5 : 50}
          />
        </li>
      );
    }

    return (
      <li
        key={field.fieldName}
        className="flex flex-row gap-3 p-2 items-center relative w-full"
      >
        <div className="flex flex-col">
          <label htmlFor={field.fieldName} className="capitalize font-semibold">
            {regularText}
          </label>
          <p className=" p-3 rounded-lg w-full" name={field.fieldName}>
            {textValue}
          </p>
        </div>
      </li>
    );
  });
  return (
    <div className="flex flex-col w-3/4 lg:w-1/2 mx-auto lg:mx-0 pl-2">
      {!showProfileHeaders && (
        <button
          className="left-0 top-[6.5rem] w-fit  aspect-square  absolute rounded-full p-2 hover:bg-gray-100 transition-all duration-200"
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
      <ul
        className={` flex flex-col gap-4 min-h-[20rem] relative ${
          currentSection !== "Order History"
            ? " max-w-[30rem]"
            : "max-w-[55rem]"
        }`}
      >
        {currentSection !== "Order History" ? fields : <OrderHistory />}
      </ul>
      <AnimatePresence>
        {isChanged && (
          <motion.div
            initial={{ opacity: 0.7, scale: 0.6, zIndex: 10 }}
            animate={{ opacity: 1, scale: 1, zIndex: 10 }}
            exit={{ opacity: 0.7, scale: 0 }}
            transition={{
              duration: 0.1, // Applies to initial and animate by default
            }}
            className="mt-4 w-fit mx-2"
          >
            <SaveButton
              dataToSave={alteredData}
              saveFunc={saveFunc}
              emailAddress={clonedInfo.email}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileContent;
