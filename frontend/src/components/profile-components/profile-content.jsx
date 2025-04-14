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
import InputBox from "../inputbox";
import { debounce } from "lodash";

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
  const [show, setShow] = useState(true);

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
        setStates([]);
      }
    }
  }, [clonedInfo, countries.current]);

  useEffect(() => {
    setClonedInfo(fetchedUserData);
  }, [fetchedUserData]);

  const resizeFunc = debounce(() => {
    setShow(!showProfileHeaders || window.innerWidth > 1024);
  }, 100);

  useEffect(() => {
    setShow(!showProfileHeaders || window.innerWidth > 1024);

    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, [showProfileHeaders]);

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
    const { fieldName, isDate, prefix, type, label, isRequired } = field;
    const commonClass = "flex flex-row gap-3 items-center relative w-full";
    const regularText = parseCamelCase(fieldName);
    const textValue = isDate
      ? new Date(clonedInfo?.createdAt).toDateString()
      : prefix
      ? clonedInfo?.[prefix]?.[fieldName]
      : clonedInfo?.[fieldName];

    // Special handling for "country" and "state"
    if (fieldName === "country") {
      return (
        <li key={fieldName} className={commonClass}>
          <Select
            options={countries.current}
            selectedValue={clonedInfo?.address?.country}
            onSelect={editfetchedUserData}
            field={field}
          />
        </li>
      );
    }
    if (fieldName === "state") {
      return (
        <li key={fieldName} className={commonClass}>
          <Select
            options={states}
            selectedValue={clonedInfo?.address?.state}
            onSelect={editfetchedUserData}
            field={field}
          />
        </li>
      );
    }

    // Handle type-specific fields
    if (type === "password") {
      return (
        <li key={fieldName} className={commonClass}>
          <PasswordField />
        </li>
      );
    }
    if (type === "input") {
      return (
        <li key={fieldName} className={commonClass}>
          {((fieldName === "email" && !clonedInfo?.verifiedEmail) ||
            (fieldName === "phoneNumber" &&
              label &&
              !clonedInfo?.verifiedPhone)) && (
            <VerifiedTag tagName={label || fieldName} />
          )}
          <label className="absolute -top-2 left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem]">
            {regularText}
            {isRequired && <span className="text-errorTrue">*</span>}
          </label>
          <InputBox
            changeFunc={(e) => editfetchedUserData(e, field)}
            maxLength={fieldName === "zipCode" ? 5 : 50}
            userData={fetchedUserData}
          >
            {textValue}
          </InputBox>
        </li>
      );
    }

    // Fallback render
    return (
      <li
        key={fieldName}
        className="flex flex-row gap-3 p-2 items-center relative w-full"
      >
        <div className="flex flex-col">
          <label htmlFor={fieldName} className="capitalize font-semibold">
            {regularText}
          </label>
          <p className="p-3 rounded-lg w-full" name={fieldName}>
            {textValue}
          </p>
        </div>
      </li>
    );
  });

  return (
    <div className="flex flex-col w-3/4 lg:w-1/2 mx-auto lg:mx-0 pl-2">
      {!showProfileHeaders && (
        <motion.button
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className=" -translate-x-[150%] aspect-square  absolute rounded-full p-1 hover:bg-gray-100 transition-all duration-200"
          onClick={() => setShowProfileHeaders(true)}
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
              d="M15.525 18.966L8.558 12l6.967-6.967"
            ></path>
          </svg>
        </motion.button>
      )}
      <AnimatePresence>
        {show && (
          <motion.div
            className=""
            initial={{
              x: `${window.innerWidth < 1024 ? "-100%" : "0"}`,
              opacity: 0,
            }}
            animate={{ x: "0", opacity: 1 }}
            exit={{
              x: `${window.innerWidth < 1024 ? "-100%" : "0"}`,
              opacity: 1,
            }}
            transition={{ duration: 0.3, type: "tween" }}
          >
            <h1 className="text-2xl mb-6">
              {currentSection?.name ? currentSection.name : ""}
            </h1>

            <ul
              className={` flex flex-col gap-4 min-h-[20rem] relative ${
                currentSection?.name !== "Order History"
                  ? " max-w-[30rem]"
                  : "max-w-[55rem]"
              }`}
            >
              {currentSection?.name !== "Order History" ? (
                fields
              ) : (
                <OrderHistory />
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChanged && (
          <motion.div
            initial={{ opacity: 0.7, scale: 0.6, zIndex: 10 }}
            animate={{ opacity: 1, scale: 1, zIndex: 10 }}
            exit={{ opacity: 0.7, scale: 0 }}
            transition={{
              duration: 0.1,
              type: "spring",
              stiffness: 400,
              damping: 20,
              mass: 0.4,
            }}
            className="mt-4 w-fit mx-2"
          >
            <SaveButton dataToSave={alteredData} saveFunc={saveFunc} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileContent;
