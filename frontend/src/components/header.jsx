import Logo from "./header-components/logo";
import HeaderTabs from "./header-components/headertabs";
import SearchButton from "./header-components/search-button";
import SearchBar from "./header-components/searchbar";
import Cart from "./header-components/cart";
import ProfileButton from "./header-components/profile-button";
import Sidebar from "./header-components/sidebar";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { motion } from "framer-motion";
import useAuth from "./utilities/useAuth";
import useFetchServerData from "./utilities/getDataFromServer";
import { useFetchSections } from "./utilities/useSectionFunctions";
import LoginModal from "./loginModal";

import { ProductContext } from "./utilities/ContextManager";
import { isEmpty } from "lodash";

const opacityVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const minYOffsetHeader = 40;

const Header = ({
  screen = "regular",
  showLoginModal = false,
  setShowLoginModal = null,
  alternateTransparent = false,
}) => {
  const [alternateDisplay, setAlternateDisplay] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { loggedIn } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const { setUserInfo, userInfo, setSections } = useContext(ProductContext);
  const [
    isFetchingSectionsLoading,
    sectionResults,
    setSectionResults,
    tryFetchSections,
  ] = useFetchSections();
  const [showLogin, setShowLogin] = useState(showLoginModal);
  const { isLoading, data, refetch } = useFetchServerData();
  const [showHeader, setShowHeader] = useState(false);

  const onScroll = useCallback(() => {
    setAlternateDisplay((prev) => {
      return window.scrollY > minYOffsetHeader !== prev
        ? window.scrollY > minYOffsetHeader
        : prev;
    });
  }, [showHeader]);

  useEffect(() => {
    setAlternateDisplay(window.scrollY > minYOffsetHeader);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    if (!data && isEmpty(userInfo)) {
      refetch({
        queries: ["cart", "firstName", "_id"],
        auth: { loggedIn },
      });
    }

    const cachedSections =
      sessionStorage.getItem("sections") !== "undefined"
        ? JSON.parse(sessionStorage.getItem("sections"))
        : null;

    if (!cachedSections) {
      tryFetchSections();
    } else {
      setSectionResults(cachedSections);
    }

    if (userInfo.firstName) {
      sessionStorage.setItem("name", userInfo.firstName);
    }
  }, [loggedIn, JSON.stringify(userInfo)]);

  useEffect(() => {
    if (sectionResults) {
      setSections(sectionResults);
      sessionStorage.setItem("sections", JSON.stringify(sectionResults));
    }
  }, [sectionResults]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data) {
        setUserInfo(data);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data, loggedIn]);

  return (
    <>
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />

      {loggedIn && userInfo && (
        <div className="bg-bgSecondaryLight text-textLight p-2 text-xs  justify-end px-4 flex flex-row w-full relative z-40">
          <div className="">Welcome Back,&nbsp;</div>
          <a
            href="/profile"
            className="hover:underline hover:text-bgTertiary transition-all duration-100 text-textLight cursor-pointer"
          >
            {sessionStorage.getItem("name")
              ? `${sessionStorage.getItem("name")}!`
              : data && data.firstName
              ? `${data.firstName}!`
              : userInfo && userInfo.firstName
              ? `${userInfo.firstName}!`
              : "User!"}
          </a>
        </div>
      )}
      <motion.div
        className={`opacity-1 ${
          screen === "home" ? "sticky" : "sticky"
        } top-0 h-[3.75rem] text-textDark ${
          alternateDisplay
            ? "bg-bgBase2/90 shadow-lg"
            : alternateTransparent && "bg-bgBase/0 text-textLight"
        }  flex px-2 flex-row justify-between w-full z-40 m-0 transition-all duration-300 py-8`}
        variants={opacityVariants}
      >
        {alternateDisplay && (
          <div className="w-full h-full absolute  top-0 left-0  backdrop-blur-sm"></div>
        )}
        <div className="flex flex-row items-end h-full my-auto gap-12 justify-between lg:justify-start  w-full">
          <div className="h-full z-[10] lg:hidden gap-3 sm:gap-4 w-fit justify-center items-center flex ">
            <Sidebar
              sections={sectionResults}
              visible={alternateDisplay}
              setShowLogin={setShowLogin}
              showLogin={showLogin}
            />
          </div>
          <div className="z-0 absolute left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2 lg:translate-x-0  lg:my-auto lg:static h-[2.5rem] ">
            <Logo invert={alternateTransparent && !alternateDisplay} />
          </div>

          {sectionResults && (
            <ul className="h-full flex items-center justify-center">
              <HeaderTabs
                sections={sectionResults}
                underlineBlack={alternateDisplay || !alternateTransparent}
              />
            </ul>
          )}
        </div>

        {/* Small Screen Buttons */}
        <div className="lg:hidden gap-1 sm:gap-4 w-fit justify-center items-center flex">
          <Cart />
          <ProfileButton showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>

        {/* Large Screen Buttons */}
        <div className="hidden lg:flex gap-3 sm:gap-4 w-fit items-center z-10 ">
          {" "}
          <SearchButton setSearch={setIsSearching} />
          <Cart />
          <ProfileButton showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>

        <SearchBar
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setHeaderVisible={setAlternateDisplay}
        />
      </motion.div>
    </>
  );
};

export default Header;
