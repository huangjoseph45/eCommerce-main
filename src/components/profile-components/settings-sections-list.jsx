import LogoutButton from "../logoutButton";

const SettingsSectionsList = ({ sections }) => {
  const accountSections = sections.map((section) => {
    return (
      <li
        key={section}
        className="list-none cursor-pointer text-lg hover:text-xl h-14 transition-all duration-100 flex items-center  w-full"
      >
        {section}
      </li>
    );
  });

  console.log(accountSections);
  return (
    <div className="flex flex-col w-1/4 p-4">
      {accountSections} <LogoutButton />
    </div>
  );
};

export default SettingsSectionsList;
