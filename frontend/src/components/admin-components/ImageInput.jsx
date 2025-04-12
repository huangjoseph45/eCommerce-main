import { useRef, useState } from "react";

const ImageInput = ({ fileArray, setFileArray, color, index }) => {
  const inputRef = useRef();
  const [containsFile, setContainsFile] = useState(false);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const imageData = Array.from(e.target.files)[0];

    setContainsFile(true);

    const files = [...fileArray];
    const existingFile = files.find(
      (file) => file.idMod === color.idMod && file.index === index
    );
    if (existingFile) {
      existingFile["data"] = imageData; // Replace existing file data with the new FormData
      setFileArray(files);
    } else {
      setFileArray([
        ...fileArray,
        { idMod: color.idMod, index: index, data: imageData },
      ]);
    }

    // Clear the file input value after the file has been processed
    e.target.value = null;
  };

  return (
    <li
      className={`mb-2 w-full outline p-2 ${
        containsFile ? "bg-errorFalse" : "bg-errorTrue"
      }`}
    >
      <button type="button" onClick={handleButtonClick}>
        Add Image
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </li>
  );
};

export default ImageInput;
