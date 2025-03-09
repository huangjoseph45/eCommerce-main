import Logo from "./header-components/logo";
import HeaderTabs from "./header-components/headertabs";
import SearchButton from "./header-components/search-button";
import SearchBar from "./header-components/searchbar";
import Cart from "./header-components/cart";
import ProfileButton from "./header-components/profile-button";
import Sidebar from "./header-components/sidebar";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import isLoggedIn from "./utilities/isLoggedIn";
import useFetchServerData from "../components/utilities/getDataFromServer";
import { useFetchSections } from "./utilities/useSectionFunctions";
import LoginModal from "./loginModal";

import { ProductContext } from "../components/utilities/ContextManager";
import { isEmpty } from "lodash";

const opacityVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const Header = ({
  showBackground = true,
  screen = "regular",
  showLoginModal = false,
  setShowLoginModal = null,
}) => {
  const [isVisible, setVisible] = useState(showBackground);
  const [isSearching, setIsSearching] = useState(false);
  const loggedIn = isLoggedIn();
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

  useEffect(() => {
    setVisible(showBackground);
  }, [showBackground]);

  useEffect(() => {
    if (location.pathname.includes("login")) {
      setShowLogin("login");
      if (setShowLoginModal) setShowLoginModal("login");
    }
    const resizeEvent = () => {
      if (window.innerWidth < 1024) {
        mouseEnter();
      } else {
        mouseLeave();
      }
    };

    resizeEvent();

    window.addEventListener("resize", resizeEvent);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("resize", resizeEvent);
    };
  }, [location.pathname]);

  useEffect(() => {
    const loggedIn = isLoggedIn();

    if (!data && isEmpty(userInfo)) {
      refetch({
        queries: ["cart", "firstName"],
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
  }, []);

  useEffect(() => {
    if (sectionResults) {
      setSections(sectionResults);
      sessionStorage.setItem("sections", JSON.stringify(sectionResults));
    }
  }, [sectionResults]);

  const mouseEnter = () => {
    if (!isVisible) {
      setVisible(true);
    }
    clearTimeout(timeoutRef.current);
  };

  const mouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(showBackground || false);
    }, 50);
  };

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
      <LoginModal
        showLogin={showLoginModal || showLogin}
        setShowLogin={setShowLoginModal || setShowLogin}
      />

      {loggedIn && userInfo && (
        <div className="bg-bgSecondaryLight text-textLight p-2 text-xs  justify-end px-4 flex flex-row w-full relative z-40">
          <div className="">Welcome Back,&nbsp;</div>
          <a
            href="/profile"
            className="hover:underline hover:text-bgTertiary transition-all duration-100 text-textLight cursor-pointer"
          >
            {data && data.firstName
              ? data.firstName
              : userInfo && userInfo.firstName
              ? userInfo.firstName
              : "User"}
          </a>
          <div className="">!</div>
        </div>
      )}
      <motion.div
        className={`opacity-1 ${
          screen === "home" ? "sticky" : "sticky"
        } top-0 h-[3.75rem] ${
          isVisible ? "bg-bgBase2 text-textDark" : "bg-none text-textLight"
        }  flex px-2 flex-row justify-between w-full z-40 m-0 transition-all duration-300`}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        variants={opacityVariants}
      >
        <div className="flex flex-row items-end h-fit my-auto gap-12">
          <Logo />
          {sectionResults && <HeaderTabs sections={sectionResults} />}
        </div>
        <div className="hidden lg:flex gap-3 sm:gap-4 w-fit items-center ">
          {" "}
          <SearchButton setSearch={setIsSearching} />
          <Cart />
          <ProfileButton
            showLogin={showLoginModal || showLogin}
            setShowLogin={setShowLoginModal || setShowLogin}
          />
        </div>
        <div className="lg:hidden gap-3 sm:gap-4 w-fit justify-center items-center flex ">
          <Sidebar
            sections={sectionResults}
            visible={isVisible}
            setShowLogin={setShowLoginModal || setShowLogin}
            showLogin={showLoginModal || showLogin}
          />
        </div>

        <SearchBar
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setHeaderVisible={setVisible}
        />
      </motion.div>
    </>
  );
};

export default Header;
