import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing server updates

import { ProductContext } from "./components/utilities/ProductContext";
import getDataFromServer from "./components/utilities/getDataFromServer";
import updateServerData from "./components/utilities/updateServerData";

import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

const products = [
  {
    productName: "Fancy Polo",
    type: "Men's Clothing",
    price: 100,
    id: "testfp-1",
    discount: 10,
    colors: [
      {
        colorName: "navy",
        colorCode: "#212e50",
        idMod: "nav",
      },
      {
        colorName: "white",
        colorCode: "#ffffff",
        idMod: "whi",
      },
    ],
    sizes: ["xs", "s", "m", "l", "xl"],
    description:
      "An American style standard since 1972, the Polo shirt has been imitated but never matched. Over the decades, Ralph Lauren has reimagined his signature style in a wide array of colors and fits, yet all retain the quality and attention to detail of the iconic original. This relaxed version is made with luxe cotton interlock that features an ultrasoft finish.",
  },
];

function App() {
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const debouncedUpdateServerData = debounce((updatedUserInfo) => {
    updateServerData({ userInfo: updatedUserInfo });
  }, 500); // Adjust the delay as needed

  // Startup function to check authentication and fetch data
  const startup = async () => {
    const cookies = document.cookie;
    console.log(cookies);
    if (cookies.includes("sessionId")) {
      try {
        const serverData = await getDataFromServer({ setUserInfo });

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching server data:", error);
        // Optionally handle the error, e.g., redirect to login
      }
    }
  };

  // Run startup on component mount
  useEffect(() => {
    startup();
  }, []);

  // Effect to handle updates to userInfo
  useEffect(() => {
    // Update server data whenever userInfo changes
    debouncedUpdateServerData(userInfo);

    // Cleanup the debounced function on unmount
    return () => {
      debouncedUpdateServerData.cancel();
    };
  }, [userInfo]);

  const productLinks = products.map((product) => {
    const stringURL = (
      encodeURIComponent(product.productName.replace(" ", "-")) +
      "/" +
      product.id
    ).toLowerCase();
    return (
      <Route
        key={product.id}
        path={`/${stringURL}`}
        element={<ProductPage product={product} />}
      />
    );
  });

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <>
      <ProductContext.Provider
        value={{ products, isLoggedIn, userInfo, setUserInfo }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shopping />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/profile" element={<ProfilePage />} />
            {productLinks}
          </Routes>
        </BrowserRouter>
      </ProductContext.Provider>
    </>
  );
}

export default App;
