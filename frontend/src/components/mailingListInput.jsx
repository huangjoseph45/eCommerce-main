import { useState } from "react";
import useAddToMailing from "./utilities/useAddToMailing";

const MailingListInput = () => {
  const [email, setEmail] = useState();
  const { addToMailing, loading, errorMessage, isSuccessful } =
    useAddToMailing();

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="absolute sm:static left-1/3 top-[4rem] pl-6 lg:pl-8 h-[6rem] flex flex-col items-start">
      <h2 className="mb-2">Stay in the loop</h2>
      <div className="flex">
        <input
          type="email"
          onChange={(e) => onChange(e)}
          placeholder="Enter Email Address"
          className="rounded-r-none h-12 first-line:mb-2 p-2 rounded bg-bgDark border border-gray-700 text-sm sm:text-base w-[12rem] sm:w-[15rem]"
        />
        <button
          className="flex items-center justify-center rounded-l-none relative w-[4rem] h-12 p-2 bg-primary text-white rounded cursor-pointer bg-bgTertiary hover:bg-bgTertiary/75"
          onClick={() => addToMailing({ email })}
        >
          {loading ? (
            <div className="absolute w-6 border-[2px] loader"></div>
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"
                />
                <script xmlns="" />
              </svg>
            </div>
          )}
        </button>
      </div>
      {errorMessage && <p className="text-errorTrue">{errorMessage}</p>}
      {isSuccessful && (
        <p className="text-errorFalse">Email successfully added</p>
      )}
    </div>
  );
};

export default MailingListInput;
