import "./index.css";
import { useState, useEffect, useRef, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductContext } from "./components/utilities/ContextManager";
import useCreateProduct, {
  useCreateTestProducts,
} from "./components/utilities/useCreateProduct";
import useFetchProducts from "./components/utilities/useFetchMultipleProducts";
import { useCreateSections } from "./components/utilities/useSectionFunctions";
import AuthProvider from "./components/utilities/AuthProvider";
import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import HomePage from "./pages/HomePage";

// const product = {
//   sku: "SKU-4",
//   colors: [
//     { colorName: "Dark Blue", colorCode: "#30364e", idMod: "dbl" },
//     { colorName: "Seafoam", colorCode: "#73a899", idMod: "sfm" },
//     { colorName: "Tan", colorCode: "#9c8d7b", idMod: "tan" },
//     { colorName: "White", colorCode: "#eaeaea", idMod: "whi" },
//   ],
//   description:
//     "We've brought back these 6-inch-inseam shorts from our archives and updated them with a comfortable drawstring waist and a touch of stretch.",
//   discount: 0,
//   price: 89.5,
//   productName: "6-Inch Polo Prepster Stretch Chino Short",
//   sizes: ["XS", "S", "M", "L", "XL"],
//   tags: ["new", "men"],
//   type: "Men's Clothing",
// };

function App() {
  const [sections, setSections] = useState([]);
  const [isCreateSectionsLoading, tryCreateSection] = useCreateSections();
  const { loadingProductsCreation, errorMessage, newProduct, createProduct } =
    useCreateProduct();
  const { createTestProducts } = useCreateTestProducts();
  const [userInfo, setUserInfo] = useState({});
  const headerRef = useRef();

  const productLinks = useRef();

  useEffect(() => {
    const endpoint = `${import.meta.env.VITE_PATH}/users/auth`;

    const handleAuth = async () => {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    };
    handleAuth();
  }, []);

  // useEffect(() => {
  //   tryCreateSection({
  //     sectionTitle: "New Arrivals",
  //     tags: ["new"],
  //     imageURL:
  //       "https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/SKU-1-nav",
  //   });
  //   if (!products || products.length < 1) refetchProducts("");
  // }, []);

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
                      path={`/${encodeURIComponent(category.slug)}`}
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
