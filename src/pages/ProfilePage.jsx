import ProfileContent from "../components/profile-components/profile-content.jsx";
import { createContext, useContext, useEffect, useState } from "react";
import { ProductContext } from "../components/utilities/ContextManager.js";
import Header from "../components/header.jsx";
import SettingsSectionsList from "../components/profile-components/settings-sections-list.jsx";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { ShowProfileContext } from "../components/utilities/ContextManager.js";
import Footer from "../components/footer.jsx";
import useFetchServerData from "../components/utilities/getDataFromServer.js";

const ProfilePage = () => {
  const [showProfileHeaders, setShowProfileHeaders] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [userInfo, setUserInfo] = useState();
  const { isLoggedIn } = useContext(ProductContext);

  const fetchFields = [
    "email",
    "firstName",
    "lastName",
    "age",
    "createdAt",
    "address",
    "phoneNumber",
  ];

  const { isLoading, data, refetch } = useFetchServerData({
    queries: fetchFields,
    auth: { isLoggedIn },
  });

  const nav = useNavigate();

  const accountSections = [
    "Account Details",
    "Communication Preferences",
    "Order History",
    "Delivery Addresses",
  ];

  const accountSectionFields = [
    { fieldName: "email", type: "input", isRequired: true },
    { fieldName: "password", type: "password", isRequired: true },
    { fieldName: "firstName", type: "input", isRequired: false },
    { fieldName: "lastName", type: "input", isRequired: false },
    { fieldName: "age", type: "input", isRequired: false },
    {
      fieldName: "createdAt",
      type: "static",

      isRequired: false,
      isDate: true,
    },
  ];

  const communicationFields = [
    {
      fieldName: "phoneNumber",
      type: "input",
      isRequired: false,
      prefix: "",
    },
    {
      fieldName: "email",
      type: "input",
      isRequired: false,
      prefix: "",
    },
  ];

  const orderHistoryFields = [];

  const locationSectionFields = [
    {
      fieldName: "country",
      type: "dropdown",
      isRequired: true,
      prefix: "address",
    },
    {
      fieldName: "state",
      type: "dropdown",
      isRequired: true,
      prefix: "address",
    },
    { fieldName: "city", type: "input", isRequired: true, prefix: "address" },
    {
      fieldName: "street",
      type: "input",
      isRequired: false,
      prefix: "address",
    },
    {
      fieldName: "zipCode",
      type: "input",
      isRequired: false,
      prefix: "address",
    },
  ];

  const sectionData = [
    accountSectionFields,
    communicationFields,
    orderHistoryFields,
    locationSectionFields,
  ];

  useEffect(() => {
    const checkWindowWidth = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        if (currentSection !== 0) setCurrentSection(0);
      } else {
        setCurrentSection(0);
      }
    }, 100);

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    const cookies = document.cookie;
    if (!cookies.includes("sessionId")) {
      nav("/");
    }

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  useEffect(() => {
    setUserInfo(data);
  }, [data]);

  return (
    <ShowProfileContext.Provider
      value={{ showProfileHeaders, setShowProfileHeaders }}
    >
      <Header></Header>

      <div className="flex flex-row pt-4  border-t-[.1rem] lg:border-t-0 border-t-black">
        <SettingsSectionsList
          sections={accountSections}
          setSection={setCurrentSection}
        />
        <ProfileContent
          currentSection={accountSections[currentSection]}
          fieldData={sectionData[currentSection]}
          fetchedUserData={userInfo}
          isLoading={isLoading}
        />
      </div>
      <Footer />
    </ShowProfileContext.Provider>
  );
};

export default ProfilePage;
