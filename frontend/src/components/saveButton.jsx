import { useContext, useEffect } from "react";
import { ProductContext } from "./utilities/ContextManager";
import useUpdateServerData from "./utilities/updateServerData";
import validateEmail from "./utilities/validateEmail";
import { isEmpty } from "lodash";
import { data } from "react-router-dom";

const SaveButton = ({ dataToSave, saveFunc }) => {
  const { isLoading, response, errorCode, refetch, setErrorCode } =
    useUpdateServerData({
      dataToUpdate: null,
    });

  const saveData = async () => {
    try {
      if (
        Object.prototype.hasOwnProperty.call(dataToSave, "email") &&
        (!validateEmail(dataToSave.email) || isEmpty(dataToSave.email))
      ) {
        setErrorCode({ message: "Email address is invalid" });
        return;
      }
      refetch(dataToSave);
    } catch (error) {
      alert("There was an error saving your data");
      console.error("Error: " + error);
    }
  };

  useEffect(() => {
    if (response && response.ok) {
      saveFunc();
    }
  }, [errorCode, response]);

  return (
    <>
      <div className="relative">
        {" "}
        <button
          className="mt-4 border w-fit px-6 py-3 rounded-lg text-textLight bg-bgSecondary mx-auto hover:bg-bgSecondaryLight transition-all duration-300"
          onClick={saveData}
        >
          Save
        </button>
        {errorCode && (
          <p
            className="absolute left-full whitespace-nowrap translate-x-4 top-1/2  -translate-y-[35%] text-errorTrue cursor-pointer hover:opacity-[55%] outline-gray-300 p-1 transition-all duration-150"
            onClick={() => setErrorCode(null)}
          >
            Error: <p>{errorCode.message}</p>
          </p>
        )}
      </div>
    </>
  );
};
export default SaveButton;
