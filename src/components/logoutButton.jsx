import useLogout from "./utilities/useLogout";

const LogoutButton = () => {
  const [loading, result, tryLogout] = useLogout();
  const logout = () => {
    tryLogout();
  };

  return (
    <button
      className="mt-4 border border-slate-900 w-fit px-4 py-2 rounded-lg text-black  hover:bg-slate-900 hover:text-white transition-all duration-200 hover:scale-110    "
      onClick={logout}
    >
      {!loading ? "Log Out" : "Logging Out..."}
    </button>
  );
};
export default LogoutButton;
