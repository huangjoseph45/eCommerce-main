import { useState, useRef, useEffect } from "react";
import isEmpty from "../utilities/isEmpty";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";

const PasswordField = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fieldValue, setFieldValue] = useState({
    oldField: "",
    primaryField: "",
    confirmationField: "",
  });
  const [message, setMessage] = useState("");
  const url = `${import.meta.env.VITE_PATH}/users/update-sensitive-data`;

  const fieldSelected = () => {
    setIsSelected(true);
  };

  const resetField = () => {
    setIsSelected(false);
    setFieldValue({
      oldField: "",
      primaryField: "",
      confirmationField: "",
    });
  };

  const handleChange = (event, location) => {
    setFieldValue({ ...fieldValue, [location]: event.target.value });
  };

  const changePassword = async () => {
    if (fieldValue.confirmationField !== fieldValue.primaryField) {
      setMessage("New Passwords Do Not Match");
    }

    let response;
    let data;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: fieldValue.oldField,
          password: fieldValue.primaryField,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Network response was not ok: ${response.statusText}`
        );
      }

      data = await response.json();
      setMessage(data.message);
      setIsSelected(false);
      resetField();
    } catch (error) {
      console.error("Error: " + error);
      setMessage("Could Not Update Sensitive Information");
    }
  };

  return (
    <>
      <div className="relative w-full ">
        <div className="flex flex-col w-full gap-4">
          <label
            htmlFor="password1"
            className="absolute top-0 -translate-y-1/2  left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem] text-textHollow"
          >
            {isSelected ? "Old Password" : "Password"}{" "}
            <p className="text-errorTrue ">*</p>
          </label>{" "}
          <input
            type={isSelected ? "text" : "password"}
            value={fieldValue.oldField}
            name="password0"
            className="outline outline-textHollow p-3 rounded-lg w-full bg-bgBase"
            onSelect={fieldSelected}
            onChange={(event) => handleChange(event, "oldField")}
          />
          {!isSelected && (
            <span
              className="text-textHollow text-sm absolute top-[1.5rem]  mt-1 z-5 -translate-y-[70%] left-5 select-none pointer-events-none  z-20"
              type="password"
            >
              ••••••••••••••••
            </span>
          )}
          <AnimatePresence>
            {isSelected && (
              <>
                <motion.label
                  initial={{ opacity: 1, scale: 0, zIndex: 10 }}
                  animate={{ opacity: 1, scale: 1, zIndex: 10 }}
                  exit={{ opacity: 1, scale: 0 }}
                  transition={{
                    duration: 0.15, // Applies to initial and animate by default
                  }}
                  htmlFor="password1"
                  className={`text-textHollow absolute top-[24%] left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem] z-10`}
                >
                  Password <p className="text-errorTrue ">*</p>
                </motion.label>
                <motion.input
                  initial={{ opacity: 0, scale: 0.95, zIndex: 0 }}
                  animate={{ opacity: 1, scale: 1, zIndex: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.15, // Applies to initial and animate by default
                  }}
                  type={isSelected ? "text" : "password"}
                  name="password1"
                  value={fieldValue.primaryField}
                  className="outline outline-textHollow p-3 rounded-lg w-full bg-bgBase z-0"
                  onSelect={fieldSelected}
                  onChange={(event) => handleChange(event, "primaryField")}
                />
                <motion.label
                  initial={{ opacity: 1, scale: 0, zIndex: 10 }}
                  animate={{ opacity: 1, scale: 1, zIndex: 10 }}
                  exit={{ opacity: 1, scale: 0 }}
                  transition={{
                    duration: 0.15, // Applies to initial and animate by default
                  }}
                  htmlFor="password2"
                  className="absolute top-[51%] left-[.9rem] bg-bgBase px-1 text-xs flex gap-[0.1rem] z-10 text-textHollow"
                >
                  Confirm Password <p className="text-errorTrue">*</p>
                </motion.label>{" "}
                <motion.input
                  initial={{ opacity: 0, scale: 0.95, zIndex: 0 }}
                  animate={{ opacity: 1, scale: 1, zIndex: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.15, // Applies to initial and animate by default
                  }}
                  type={isSelected ? "text" : "password"}
                  value={fieldValue.confirmationField}
                  name="password2"
                  className="outline outline-textHollow p-3 rounded-lg w-full bg-bgBase"
                  onSelect={fieldSelected}
                  onChange={(event) => handleChange(event, "confirmationField")}
                />
                <div className="flex flex-row">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6, zIndex: 0 }}
                    animate={{ opacity: 1, scale: 1, zIndex: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{
                      duration: 0.15, // Applies to initial and animate by default
                    }}
                    className=" w-fit px-4 py-2 rounded-md bg-bgSecondary text-textLight hover:bgExtraSecondaryLight whitespace-nowrap"
                    onClick={changePassword}
                  >
                    Save Password
                  </motion.button>
                  {!isEmpty(message) && (
                    <span className="items-center justify-center flex px-4 text-textDark">
                      {message}
                    </span>
                  )}
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PasswordField;
