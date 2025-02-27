import "./index.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductContext } from "./components/utilities/ContextManager";
import useCreateProduct from "./components/utilities/useCreateProduct";
import useFetchProducts from "./components/utilities/useFetchMultipleProducts";
import { useCreateSections } from "./components/utilities/useSectionFunctions";

import Shopping from "./pages/Shopping";
import NoPage from "./pages/NoPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import HomePage from "./pages/HomePage";

const product = {
  sku: "SKU-4",
  colors: [
    { colorName: "Dark Blue", colorCode: "#30364e", idMod: "dbl" },
    { colorName: "Seafoam", colorCode: "#73a899", idMod: "sfm" },
    { colorName: "Tan", colorCode: "#9c8d7b", idMod: "tan" },
    { colorName: "White", colorCode: "#eaeaea", idMod: "whi" },
  ],
  description:
    "We've brought back these 6-inch-inseam shorts from our archives and updated them with a comfortable drawstring waist and a touch of stretch.",
  discount: 0,
  price: 89.5,
  productName: "6-Inch Polo Prepster Stretch Chino Short",
  sizes: ["XS", "S", "M", "L", "XL"],
  tags: ["new", "men"],
  type: "Men's Clothing",
};

function App() {
  const [sections, setSections] = useState([]);
  const [isCreateSectionsLoading, tryCreateSection] = useCreateSections();
  const { loadingProductsCreation, errorMessage, newProduct, createProduct } =
    useCreateProduct();
  const [isLoading, products, refetchProducts] = useFetchProducts();
  const [userInfo, setUserInfo] = useState({});

  const productLinks = useRef();

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

  useEffect(() => {
    console.log(sections);
    createProduct(product);
  }, [sections]);

  return (
    <>
      <ProductContext.Provider
        value={{ products, userInfo, setUserInfo, sections, setSections }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/s/" element={<Shopping />} />
            <Route path="/new" element={<Shopping />} />

            <Route path="*" element={<NoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<SuccessPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
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
                        searchQuery={category.tags}
                      />
                    }
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
