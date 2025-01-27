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
      className="mt-4 border border-slate-900 w-fit px-4 py-2 rounded-lg text-black  hover:bg-slate-900 hover:text-white transition-all duration-200 hover:scale-110    "
      onClick={logout}
    >
      Log Out
    </button>
  );
};
export default LogoutButton;
