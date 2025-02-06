import { useContext, useEffect } from "react";
import { ProductContext } from "./utilities/ContextManager";
import useUpdateServerData from "./utilities/updateServerData";

const SaveButton = ({ dataToSave, saveFunc, emailAddress }) => {
  console.log(dataToSave);
  const { isLoading, response, errorCode, refetch, setErrorCode } =
    useUpdateServerData({
      dataToUpdate: null,
    });

  const saveData = async () => {
    try {
      if (!dataToSave.email) {
        dataToSave.email = emailAddress;
      }
      refetch(dataToSave);
    } catch (error) {
      alert("There was an error saving your data");
      console.error("Error: " + error);
    }
  };

  useEffect(() => {
    console.log(errorCode);
    if (response && response.ok) {
      saveFunc();
    }
  }, [errorCode, response]);
  return (
    <>
      <div className="relative">
        {" "}
        <button
          className="mt-4 border w-fit px-6 py-3 rounded-lg text-white bg-slate-800 mx-auto hover:bg-slate-700 transition-all duration-300"
          onClick={saveData}
        >
          Save
        </button>
        {errorCode && (
          <p
            className="absolute  left-full whitespace-nowrap translate-x-4 top-1/2  -translate-y-[35%] text-red-600 cursor-pointer hover:opacity-[55%]  outline-gray-300 p-1 transition-all duration-150"
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
