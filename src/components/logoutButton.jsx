import useLogout from "./utilities/useLogout";

const LogoutButton = () => {
  const [loading, result, tryLogout] = useLogout();
  const logout = () => {
    tryLogout();
  };

  return (
    <button
      className="border border-bgSecondary w-fit px-4 py-2 rounded-lg text-textDark  hover:bg-bgSecondary hover:text-textLight transition-all duration-200 hover:scale-110 min-w-20 items-center justify-center flex h-10"
      onClick={logout}
    >
      {!loading ? (
        "Log Out"
      ) : (
        <p className="loader top-1/3 left-1/2 -translate-x-1/2 size-6 hover:border-white"></p>
      )}
    </button>
  );
};
export default LogoutButton;
