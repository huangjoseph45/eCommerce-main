import { useContext } from "react";
import { ProductContext } from "./utilities/ProductContext";

const SaveButton = ({ dataToSave }) => {
  const { setUserInfo } = useContext(ProductContext);
  const saveData = async () => {
    try {
      const response = await setUserInfo(dataToSave);
    } catch (error) {
      alert("There was an error saving your data");
      console.error("Error: " + error);
    }
  };
  return (
    <button
      className="mt-4 border w-fit px-6 py-3 rounded-lg text-white bg-slate-800 mx-auto hover:bg-slate-700 transition-all duration-300"
      onClick={saveData}
    >
      Save
    </button>
  );
};
export default SaveButton;
