import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ProductContext } from "../utilities/ProductContext";

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
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 48 48"
        role="img"
        width="60px"
        height="60px"
        fill="none"
        title="Profile"
        onClick={clickedFunc}
        className="cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full hidden lg:block"
      >
        <path
          stroke="currentColor"
          strokeWidth="3"
          d="M7.5 42v-6a7.5 7.5 0 017.5-7.5h18a7.5 7.5 0 017.5 7.5v6m-9-27a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
        ></path>
      </svg>
    </>
  );
};

export default ProfileButton;
