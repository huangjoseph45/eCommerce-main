import useLogout from "./utilities/useLogout";

const LogoutButton = () => {
  const [loading, result, tryLogout] = useLogout();
  const logout = () => {
    tryLogout();
  };

  return (
    <button
      className="mt-4 border border-bgSecondary w-fit px-4 py-2 rounded-lg text-textDark  hover:bg-bgSecondary hover:text-textLight transition-all duration-200 hover:scale-110    "
      onClick={logout}
    >
      {!loading ? "Log Out" : "Logging Out..."}
    </button>
  );
};
export default LogoutButton;
