import ProfileContent from "../components/profile-components/profile-content.jsx";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header.jsx";
import SettingsSectionsList from "../components/profile-components/settings-sections-list.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer.jsx";
import useFetchServerData from "../components/utilities/getDataFromServer.js";
import useAuth from "../components/utilities/useAuth.jsx";
import { debounce } from "lodash";

const ProfilePage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [userInfo, setUserInfo] = useState();
  const { awaitingAuth, loggedIn } = useAuth();
  const fetchFields = [
    "email",
    "firstName",
    "lastName",
    "age",
    "createdAt",
    "address",
    "phoneNumber",
    "orderHistory",
    "verifiedEmail",
    "verifiedPhone",
  ];

  const { isLoading, data, refetch } = useFetchServerData();
  const [showContent, setShowContent] = useState(true);
  const { profileSection } = useParams();
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      nav("/profile/account");
    } else if (!profileSection) {
      setShowContent(false);
      return;
    }
  }, []);

  useEffect(() => {
    let idx;
    const foundSection = settingSections.find((section, index) => {
      idx = index;

      return section.slug.toLowerCase() === profileSection?.toLowerCase();
    });
    if (foundSection) {
      setCurrentSection(idx);
      setShowContent(true);
    }
    const resizeFunc = () => {
      if (
        window.innerWidth < 1024 &&
        (window.innerWidth > prevWidth.current + 50 ||
          window.innerWidth < prevWidth.current - 50)
      ) {
        prevWidth.current = window.innerWidth;
      } else if (window.innerWidth > 1024) {
        if (currentSection === null || currentSection === undefined) {
          nav("/profile/account");
        } else if (settingSections[currentSection].slug !== foundSection) {
          nav("/profile/" + settingSections[currentSection].slug);
        }
      }
    };
    resizeFunc();
    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, [profileSection]);

  const nav = useNavigate();

  const settingSections = [
    {
      name: "Account Details",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 1024 1024"
          fill="#000000"
          className="icon"
          version="1.1"
        >
          <path
            d="M110.4 923.2c-56.8 0-102.4-48-102.4-106.4V285.6c0-58.4 45.6-106.4 102.4-106.4h800.8c56.8 0 102.4 48 102.4 106.4V816c0 58.4-45.6 106.4-102.4 106.4H110.4z m0-701.6c-34.4 0-61.6 28.8-61.6 64V816c0 35.2 28 64 61.6 64h800.8c34.4 0 61.6-28.8 61.6-64V285.6c0-35.2-28-64-61.6-64H110.4z"
            fill=""
          />
          <path
            d="M541.6 392c-12.8 0-23.2-10.4-23.2-24s10.4-24 23.2-24h328c12.8 0 23.2 10.4 23.2 24s-10.4 24-23.2 24h-328zM541.6 511.2c-12.8 0-23.2-10.4-23.2-24s10.4-24 23.2-24h328c12.8 0 23.2 10.4 23.2 24s-10.4 24-23.2 24h-328zM541.6 638.4c-12.8 0-23.2-10.4-23.2-24s10.4-24 23.2-24h276.8c12.8 0 23.2 10.4 23.2 24s-10.4 24-23.2 24H541.6zM58.4 886.4c-2.4 0-4.8 0-7.2-0.8-12.8-4-20-18.4-16-32 23.2-78.4 77.6-142.4 148-176l16-8-13.6-12c-40-34.4-63.2-85.6-63.2-139.2 0-100 78.4-180.8 173.6-180.8 96 0 173.6 80.8 173.6 180.8 0 53.6-23.2 104.8-63.2 139.2l-13.6 12 16 8c68 32 132.8 112 157.6 194.4 16 52.8-16.8 36-1.6 16-3.2 4.8-16.8-5.6-32-5.6-12.8 0-19.2 24.8-19.2 22.4-31.2-104-120.8-203.2-217.6-203.2-99.2 0-186.4 67.2-216 166.4-1.6 11.2-11.2 18.4-21.6 18.4z m239.2-498.4c-69.6 0-126.4 58.4-126.4 130.4s56.8 130.4 126.4 130.4c69.6 0 126.4-58.4 126.4-130.4-0.8-72-56.8-130.4-126.4-130.4z"
            fill=""
          />
          <script xmlns="" />
        </svg>
      ),
      slug: "account",
    },
    {
      name: "Communication Preferences",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 20 20"
          version="1.1"
        >
          <title>
            communication / 15 - communication, bubble, message, text, chat,
            comment, talk, speech icon
          </title>
          <g
            id="Free-Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g
              transform="translate(-1191.000000, -156.000000)"
              id="Group"
              stroke="#000000"
              strokeWidth="1"
            >
              <g transform="translate(1189.000000, 154.000000)" id="Shape">
                <path d="M8.6109715,18.5930706 L4.8,21 L5.46773712,16.7827129 C3.88371393,15.3227187 3,13.2946794 3,11.0526316 C3,6.60528596 6.4771525,3 12,3 C17.5228475,3 21,6.60528596 21,11.0526316 C21,15.4999772 17.5228475,19.1052632 12,19.1052632 C10.7621927,19.1052632 9.62714465,18.9241626 8.6109715,18.5930706 L8.6109715,18.5930706 Z"></path>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="12" y2="13"></line>
              </g>
            </g>
          </g>
          <script xmlns="" />
        </svg>
      ),
      slug: "communication",
    },
    {
      name: "Order History",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28px"
          height="28px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect x="5" y="4" width="14" height="17" rx="2" stroke="#222222" />
          <path d="M9 9H15" stroke="#222222" strokeLinecap="round" />
          <path d="M9 13H15" stroke="#222222" strokeLinecap="round" />
          <path d="M9 17H13" stroke="#222222" strokeLinecap="round" />
          <script xmlns="" />
        </svg>
      ),
      slug: "order",
    },
    {
      name: "Delivery Addresses",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 1024 1024"
          fill="#000000"
          className="icon"
          version="1.1"
          strokeWidth="1"
        >
          <path
            d="M512 1012.8c-253.6 0-511.2-54.4-511.2-158.4 0-92.8 198.4-131.2 283.2-143.2h3.2c12 0 22.4 8.8 24 20.8 0.8 6.4-0.8 12.8-4.8 17.6-4 4.8-9.6 8.8-16 9.6-176.8 25.6-242.4 72-242.4 96 0 44.8 180.8 110.4 463.2 110.4s463.2-65.6 463.2-110.4c0-24-66.4-70.4-244.8-96-6.4-0.8-12-4-16-9.6-4-4.8-5.6-11.2-4.8-17.6 1.6-12 12-20.8 24-20.8h3.2c85.6 12 285.6 50.4 285.6 143.2 0.8 103.2-256 158.4-509.6 158.4z m-16.8-169.6c-12-11.2-288.8-272.8-288.8-529.6 0-168 136.8-304.8 304.8-304.8S816 145.6 816 313.6c0 249.6-276.8 517.6-288.8 528.8l-16 16-16-15.2zM512 56.8c-141.6 0-256.8 115.2-256.8 256.8 0 200.8 196 416 256.8 477.6 61.6-63.2 257.6-282.4 257.6-477.6C768.8 172.8 653.6 56.8 512 56.8z m0 392.8c-80 0-144.8-64.8-144.8-144.8S432 160 512 160c80 0 144.8 64.8 144.8 144.8 0 80-64.8 144.8-144.8 144.8zM512 208c-53.6 0-96.8 43.2-96.8 96.8S458.4 401.6 512 401.6c53.6 0 96.8-43.2 96.8-96.8S564.8 208 512 208z"
            fill=""
          />
          <script xmlns="" />
        </svg>
      ),
      slug: "address",
    },
  ];

  const accountSectionFields = [
    { fieldName: "email", type: "input", isRequired: true },
    { fieldName: "password", type: "password", isRequired: true },
    { fieldName: "firstName", type: "input", isRequired: false },
    { fieldName: "lastName", type: "input", isRequired: false },
    { fieldName: "age", type: "input", isRequired: false },
    {
      fieldName: "createdOn",
      type: "static",

      isRequired: false,
      isDate: true,
    },
  ];

  const communicationFields = [
    {
      fieldName: "phoneNumber",
      label: "phone number",
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
      label: "zip code",
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
    if (!data) {
      refetch({
        queries: fetchFields,
        auth: { loggedIn },
      });
    }
  }, [data]);

  useEffect(() => {
    if (!awaitingAuth && loggedIn === false) {
      nav("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (data && data.email) {
      setUserInfo(data);
    }
  }, [data]);

  return (
    <div className="relative min-h-screen">
      {" "}
      <Header></Header>
      <div className="flex flex-row pt-4  lg:border-t-0 border-t-black">
        <SettingsSectionsList
          sections={settingSections}
          setSection={setCurrentSection}
          showContent={showContent}
        />
        <ProfileContent
          currentSection={settingSections[currentSection]}
          fieldData={sectionData[currentSection]}
          fetchedUserData={userInfo}
          isLoading={isLoading}
          showContent={showContent}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
