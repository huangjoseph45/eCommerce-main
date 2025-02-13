import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const VerifiedTag = ({ tagName }) => {
  return (
    <div className="absolute left-full group translate-x-1/4 z-10">
      <div className="text-xl cursor-pointer text-errorTrue p-2 w-8 h-8 flex items-center justify-center rounded-full">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="-translate-y-[0.5px]"
        />
      </div>
      <div className="absolute lg:left-0 left-full top-full lg:top-0 -translate-x-full lg:translate-x-10 opacity-0 group-hover:opacity-100 transition-opacity bg-errorTrue/85 text-textLight p-2 w-[8rem] rounded-md text-xs z-20">
        Your {tagName} is not verified
      </div>
    </div>
  );
};

export default VerifiedTag;
