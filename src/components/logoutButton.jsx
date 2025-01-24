import { useContext } from "react";
import { ProductContext } from "./utilities/ProductContext";
import handleLogout from "./utilities/handleLogout";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const nav = useNavigate();
  const { setUserInfo } = useContext(ProductContext);
  const logout = async () => {
    await handleLogout();
    nav("/login");
  };

  return (
    <button
      className="mt-4 border w-fit px-4 py-2 rounded-sm text-white bg-slate-800  hover:bg-slate-700 transition-all duration-300"
      onClick={logout}
    >
      Log Out
    </button>
  );
};
export default LogoutButton;
