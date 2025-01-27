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

  const fieldSelected = () => {
    setIsSelected(true);
  };

  const resetField = () => {
    setIsSelected(false);
    setFieldValue({
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
      const response = await fetch(
        "http://localhost:2000/api/users/update-sensitive-data",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: fieldValue.oldField,
            password: fieldValue.primaryField,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Network response was not ok: ${response.statusText}`
        );
      }

      data = await response.json();
      console.log("Update Successful:", data);
      setMessage(data.message);
    } catch (error) {
      console.error("Error: " + error);
      setMessage("Could Not Update Sensitive Information");
    }
  };

  return (
    <>
      <div className="relative w-full">
        <div className="flex flex-col w-full gap-4">
          <label
            htmlFor="password1"
            className="absolute top-0 -translate-y-1/2  left-[.9rem] bg-white px-1 text-xs flex gap-[0.1rem]"
          >
            {isSelected ? "Old Password" : "Password"}{" "}
            <p className="text-red-600 ">*</p>
          </label>{" "}
          <input
            type={isSelected ? "text" : "password"}
            value={fieldValue.oldField}
            name="password0"
            className="outline outline-gray-600 p-3 rounded-lg w-full"
            onSelect={fieldSelected}
            onChange={(event) => handleChange(event, "oldField")}
          />
          {!isSelected && (
            <span
              className="text-black text-sm absolute top-[1.5rem]  mt-1 z-5 -translate-y-[70%] left-5 select-none pointer-events-none  z-20"
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
                  className={`absolute top-[24%] left-[.9rem] bg-white px-1 text-xs flex gap-[0.1rem] z-10`}
                >
                  Password <p className="text-red-600 ">*</p>
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
                  className="outline outline-gray-600 p-3 rounded-lg w-full  z-0"
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
                  className="absolute top-[51%] left-[.9rem] bg-white px-1 text-xs flex gap-[0.1rem] z-10"
                >
                  Confirm Password <p className="text-red-600 ">*</p>
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
                  className="outline outline-gray-600 p-3 rounded-lg w-full"
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
                    className=" w-fit px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 whitespace-nowrap"
                    onClick={changePassword}
                  >
                    Save Password
                  </motion.button>
                  {!isEmpty(message) && (
                    <span className="items-center justify-center flex px-4 text-black">
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
