import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductContext } from "./components/utilities/ContextManager";
import useUpdateServerData from "./components/utilities/updateServerData";
import useFetchProducts from "./components/utilities/useFetchMultipleProducts";

import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import SearchResultsPage from "./pages/SearchResultsPage";

const createProduct = async (product) => {
  try {
    const response = await fetch(
      "http://localhost:2000/api/products/create-product",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product) || null,
      }
    );

    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
};

function App() {
  const productsList = [
    {
      productName: "Fancy Polo",
      type: "Men's Clothing",
      price: 100,
      sku: "SKU-1",
      tags: ["hi"],
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
  const { isLoading, products, refetchProducts } = useFetchProducts();
  const [userInfo, setUserInfo] = useState({});
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });

  useEffect(() => {
    refetch(userInfo);
  }, [userInfo]);

  useEffect(() => {
    createProduct(productsList[0]);
    if (!products || products.length < 1) refetchProducts("");
  }, []);

  return (
    <>
      <ProductContext.Provider value={{ products, userInfo, setUserInfo }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Shopping />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            {products &&
              Array.isArray(products) &&
              products.length > 0 &&
              products.map((product) => {
                const stringURL = (
                  encodeURIComponent(product.productName.replace(/ /g, "-")) +
                  "/" +
                  product.sku
                ).toLowerCase();

                return (
                  <Route
                    key={product.sku}
                    path={`/${stringURL}`}
                    element={<ProductPage product={product} />}
                  />
                );
              })}
          </Routes>
        </BrowserRouter>
      </ProductContext.Provider>
    </>
  );
}

export default App;
