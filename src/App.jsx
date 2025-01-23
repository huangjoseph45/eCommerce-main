import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const cart = userInfo.cart;

  const startup = async () => {
    const cookies = document.cookie;

    if (cookies.includes("sessionId")) {
      try {
        const serverData = await getDataFromServer({ setUserInfo });
      } catch (error) {
        console.error("Error: " + error);
      }
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    if (cart === undefined) setUserInfo({ ...userInfo, cart: [] });
    updateServerData({ userInfo });
  }, [userInfo, cart]);

  useEffect(() => startup, []);

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
