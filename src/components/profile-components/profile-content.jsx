import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../utilities/ProductContext";
import parseCamelCase from "../utilities/parseCamelCase";
import SaveButton from "../saveButton";

const ProfileContent = ({ currentSection, fieldNames }) => {
  const [isChanged, setIsChanged] = useState(false);
  const { userInfo } = useContext(ProductContext);
  const [clonedInfo, setClonedInfo] = useState(structuredClone(userInfo));

  useEffect(() => {
    setClonedInfo(structuredClone(userInfo));
  }, [userInfo]);

  const editUserInfo = (e, field) => {
    setClonedInfo({ ...clonedInfo, [field.fieldName]: e.target.value });
    setIsChanged(true);
  };

  useEffect(() => {
    console.log(clonedInfo);
  }, [clonedInfo]);

  const fields = fieldNames.map((field) => {
    let regularText = field.fieldName;
    let textValue;
    if (regularText instanceof Date) {
      textValue = new Date(clonedInfo?.creationDate).toDateString();
    } else {
      regularText = parseCamelCase(field.fieldName);
      textValue = clonedInfo?.[field.fieldName];
    }

    return (
      <p key={field.fieldName} className="flex flex-row gap-1 p-2 items-center">
        <p>{regularText}:</p>
        {field.editable ? (
          <input
            type="text"
            defaultValue={textValue}
            className="outline outline-gray-600 p-1"
            onChange={(e) => editUserInfo(e, field)}
          />
        ) : (
          <p>{textValue}</p>
        )}
      </p>
    );
  });
  return (
    <div className="flex flex-col w-1/2">
      <h1 className="text-2xl mb-2">{currentSection}</h1>
      {fields}
      {isChanged && <SaveButton dataToSave={clonedInfo} />}
    </div>
  );
};

export default ProfileContent;
