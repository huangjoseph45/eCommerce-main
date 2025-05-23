import { useState } from "react";
import useAddToMailing from "./utilities/useAddToMailing";
import InputBox from "./inputbox";

const MailingListInput = () => {
  const [email, setEmail] = useState();
  const { addToMailing, loading, errorMessage, isSuccessful } =
    useAddToMailing();

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="absolute sm:static right-4 top-[2rem] sm:top-[4rem] pl-6 lg:pl-8 h-[6rem] flex flex-col items-start mr-2">
      <div className="relative"> </div>
      <h2 className="mb-2">Stay in the loop</h2>
      <div className="flex">
        <input
          type="email"
          onChange={(e) => onChange(e)}
          placeholder="Enter Email Address"
          className="rounded-r-none h-12 first-line:mb-2 p-2 rounded bg-bgBase2 border  text-sm sm:text-base w-full sm:w-[13rem] md:w-[14rem] lg:w-[15rem] focus:outline-none"
          autoComplete="email"
        />
        <button
          className="flex items-center justify-center rounded-l-none relative w-[2.5rem] md:w-[3rem] h-12 p-2 bg-primary text-textLight rounded cursor-pointer bg-bgSecondaryLight hover:bg-bgExtraSecondaryLight"
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
                  stroke="#ffffff"
                  strokeWidth="1"
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
