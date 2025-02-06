import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ProductContext } from "../utilities/ContextManager";

const ProfileButton = () => {
  const nav = useNavigate();
  const { isLoggedIn } = useContext(ProductContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const clickedFunc = () => {
    const cookies = document.cookie;
    if (!cookies.includes("sessionId")) {
      nav("/login");
    } else {
      nav("/profile");
    }
  };

  return (
    <>
      <div className="relative aspect-square rounded-full cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 48"
          role="img"
          width="40px"
          height="40px"
          fill="none"
          title="Profile"
          onClick={clickedFunc}
          className=""
        >
          <path
            stroke="currentColor"
            strokeWidth="3"
            d="M7.5 42v-6a7.5 7.5 0 017.5-7.5h18a7.5 7.5 0 017.5 7.5v6m-9-27a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default ProfileButton;
