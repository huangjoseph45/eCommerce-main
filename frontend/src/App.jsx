import "./index.css";
import { useState, useEffect, useRef, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductContext } from "./components/utilities/ContextManager";
import AuthProvider from "./components/utilities/AuthProvider";
import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

const product = {
  sku: "SKU-5",
  colors: [
    { colorName: "Black", colorCode: "#000000", idMod: "bla", numImages: 3 },
  ],
  description: `The Classic Hoodie is made from heavy 380gsm core fleece to provide ideal comfort and structure. The signature "Essentials Fear of God" soft-touch logo is branded across the back. Details include an double-layer hoodie, rib-knit cuffs, waist-hem, and a kangaroo pocket. An updated Fear of God Essentials translucent rubberized label is stitched on the hood and cuff. `,
  discount: 0,
  price: 89.5,
  productName: "Essentials Classic Hoodie",
  sizes: ["XS", "S", "M", "L", "XL"],
  tags: ["new", "men", "hoodies"],
  type: "Men's Clothing",
};

function App() {
  const [sections, setSections] = useState([]);

  const [userInfo, setUserInfo] = useState({});

  const productLinks = useRef();

  // useEffect(() => {
  //   if (products && Array.isArray(products))
  //     productLinks.current = products.map((product) => {
  //       const stringURL = (
  //         "p/" +
  //         encodeURIComponent(product.productName.replace(/ /g, "-")) +
  //         "/" +
  //         product.sku
  //       ).toLowerCase();

  //       return (
  //         <Route
  //           key={product.sku}
  //           path={`/${stringURL}`}
  //           element={<ProductPage product={product} />}
  //         />
  //       );
  //     });
  //   else {
  //     refetchProducts("");
  //   }
  // }, [products]);

  return (
    <>
      <AuthProvider>
        <ProductContext.Provider
          value={{ userInfo, setUserInfo, sections, setSections }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/s/" element={<Shopping />} />
              <Route path="/new" element={<Shopping />} />

              <Route path="*" element={<NoPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dev" element={<AdminPage />} />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<SuccessPage />} />
              <Route path="/search" element={<Shopping isSearch={true} />} />
              <Route
                path="/p/:productName/:productId/:color?/:size?"
                element={<ProductPage />}
              />

              {productLinks.current}
              {sections &&
                sections.map((category, index) => {
                  return (
                    <Route
                      key={`category-${index}`}
                      path={`/${encodeURIComponent(
                        category.slug
                      )}/:subsection?`}
                      element={
                        <Shopping
                          categoryName={category.sectionTitle}
                          categoryId={category._id}
                          tags={category.tags}
                        />
                      }
                    />
                  );
                })}
            </Routes>
          </BrowserRouter>
        </ProductContext.Provider>
      </AuthProvider>
    </>
  );
}

export default App;
