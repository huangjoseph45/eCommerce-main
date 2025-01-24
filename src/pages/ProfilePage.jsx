import ProfileContent from "../components/profile-components/profile-content.jsx";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../components/utilities/ProductContext.js";
import Header from "../components/header.jsx";
import SettingsSectionsList from "../components/profile-components/settings-sections-list.jsx";
import debounce from "lodash.debounce";

const ProfilePage = () => {
  const { userInfo } = useContext(ProductContext);
  const [currentSection, setCurrentSection] = useState(null);

  const accountSections = [
    "Account Details",
    "Communication Preferences",
    "Order History",
    "Delivery Addresses",
  ];

  const accountSectionFields = [
    { fieldName: "firstName", editable: true },
    { fieldName: "lastName", editable: true },
    { fieldName: "email", editable: true },
    { fieldName: "address", editable: true },
    { fieldName: "age", editable: true },
  ];

  useEffect(() => {
    const checkWindowWidth = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        if (!currentSection) setCurrentSection(accountSections[0]);
      } else {
        setCurrentSection(null);
      }
    }, 100);

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  });

  console.log(userInfo);
  return (
    <>
      <Header></Header>
      <div className="flex flex-row pt-4">
        <SettingsSectionsList sections={accountSections} />
        <ProfileContent
          currentSection={currentSection}
          fieldNames={accountSectionFields}
        />
      </div>
    </>
  );
};

export default ProfilePage;
