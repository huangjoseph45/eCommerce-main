import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing server updates

import { ProductContext } from "./components/utilities/ContextManager";
import getDataFromServer from "./components/utilities/getDataFromServer";
import updateServerData from "./components/utilities/updateServerData";

import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";

const products = [
  {
    productName: "Fancy Polo",
    type: "Men's Clothing",
    price: 100,
    id: "testfp1",
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
  }, 500);

  // Startup function to check authentication and fetch data
  const startup = async () => {
    const response = fetch(
      "http://localhost:2000/api/products/create-product",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products[0]),
      }
    );
    console.log("HI");

    const cookies = document.cookie;
    if (cookies.includes("sessionId")) {
      try {
        setIsLoggedIn(true);
        const serverData = await getDataFromServer({ setUserInfo, userInfo });
      } catch (error) {
        console.error("Error fetching server data:", error);
      }
    } else {
      setIsLoggedIn(false);
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
      if (!isLoggedIn) setIsLoggedIn(true);
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
            <Route path="/cart" element={<CartPage />} />

            {productLinks}
          </Routes>
        </BrowserRouter>
      </ProductContext.Provider>
    </>
  );
}

export default App;
