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
    console.log("clicked");
    if (isLoggedIn) {
      nav("/profile");
    } else {
      nav("/login");
    }
  };

  return (
    <FontAwesomeIcon
      className="text-black cursor-pointer size-8 md:size-6 hover:bg-slate-500 hover:bg-opacity-25 p-3 rounded-full hidden lg:block"
      icon={faUser}
      title="Profile"
      onClick={clickedFunc}
    />
  );
};

export default ProfileButton;
