import Logo from "./header-components/logo";
import HeaderTabs from "./header-components/headertabs";
import SearchButton from "./header-components/search-button";
import SearchBar from "./header-components/searchBar";
import Cart from "./header-components/cart";
import ProfileButton from "./header-components/profile-button";
import Sidebar from "./header-components/sidebar";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

import useFetchServerData from "../components/utilities/getDataFromServer";

import { ProductContext } from "../components/utilities/ContextManager";

const opacityVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const Header = () => {
  const [isVisible, setVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    document.cookie.includes("sessionId")
  );

  const location = useLocation();
  const timeoutRef = useRef(null);
  const { setUserInfo, userInfo } = useContext(ProductContext);

  const { isLoading, data, refetch } = useFetchServerData();

  useEffect(() => {
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
    if (!data)
      refetch({
        queries: ["cart", "firstName"],
        auth: { isLoggedIn },
      });
  }, []);

  const mouseEnter = () => {
    if (!isVisible) {
      setVisible(true);
    }
    clearTimeout(timeoutRef.current);
  };

  const mouseLeave = () => {
    if (location.pathname !== "/" && window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        // setVisible(false);
      }, 3000);
    }
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
  }, [data, isLoggedIn]);

  useEffect(() => {
    if (!isLoading && data && isLoggedIn) {
      const cookies = document.cookie;

      if (cookies.includes("sessionId")) {
        setIsLoggedIn(true);
        console.log("hi");
        refetch({
          queries: ["cart", "firstName"],
          auth: { isLoggedIn },
        });
      } else {
        setIsLoggedIn(false);
        setUserInfo({});
      }
    }
  }, [isLoggedIn]);

  return (
    <>
      {" "}
      {isLoggedIn && userInfo && data?.firstName && (
        <div className="bg-[#041e3a] text-white p-2 text-xs  justify-end px-4 flex flex-row">
          <div className="">Welcome Back,&nbsp;</div>
          <a
            href="/profile"
            className="hover:underline transition-all duration-300 text-gray-200 cursor-pointer"
          >
            {data.firstName}
          </a>
          <div className="">!</div>
        </div>
      )}
      <motion.div
        className={`sticky top-0 bg-white h-[4rem] flex px-4 py-2 flex-row justify-between min-h-[2rem] max-h-[5rem] z-40  border-b ${
          isVisible ? "opacity-1" : "opacity-0"
        }`}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        variants={opacityVariants}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-row items-end h-fit my-auto gap-12">
          <Logo />
          <HeaderTabs />
        </div>
        <div className="hidden lg:flex gap-3 sm:gap-4 w-fit items-center ">
          {" "}
          <SearchButton setSearch={setIsSearching} />
          <Cart />
          <ProfileButton />
        </div>
        {/* Utility Items for PC/Large Screens */}
        <div className="lg:hidden gap-3 sm:gap-4 w-fit justify-center items-center flex">
          <Sidebar />
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
