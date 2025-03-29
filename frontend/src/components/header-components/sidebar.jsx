import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLinks from "./sectionlinks";
import SearchBar from "./searchbar";
import ProfileButton from "./profile-button";
import Cart from "./cart";
import SearchButton from "./search-button";
import { ProductContext } from "../utilities/ContextManager";
import { useNavigate } from "react-router-dom";
import useAuth from "../utilities/useAuth";
import useProductsForCart from "../utilities/getProductsForCart";

import useSideBarToggle from "../utilities/sideBarToggles";
import { createPortal } from "react-dom";

const Sidebar = ({ sections, visible, setShowLogin, showLogin }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const nav = useNavigate();
  const { loggedIn } = useAuth();
  const { userInfo } = useContext(ProductContext);
  const [loading, products, fetchProducts] = useProductsForCart();
  const [cart, setCart] = useState();
  const sectionElements = SectionLinks(sections, setShowSidebar);
  const [subtotalCost, setSubtotalCost] = useState(0);
  useSideBarToggle({ setShowSidebar, isSearching, showSidebar });

  // useEffect(() => {
  //   if (userInfo && userInfo !== undefined && userInfo.cart && products) {
  //     let cost = 0;
  //     userInfo.cart.forEach((item) => {
  //       const sku = item.sku
  //         ? item.sku.split("-")[0] + "-" + item.sku.split("-")[1]
  //         : "";
  //       const product = products.find((product) => {
  //         const productSKU = product.sku ? product.sku.toLowerCase() : null;
  //         const cartSKU = sku ? sku.toLowerCase() : null;
  //         return productSKU === cartSKU;
  //       });
  //       if (product) {
  //         cost += item.quantity * product.price * (1 - product.discount / 100);
  //       }
  //     });
  //     setSubtotalCost(cost.toFixed(2));
  //   }
  // }, [products, userInfo?.cart]);

  useEffect(() => {
    if (userInfo && userInfo.cart && userInfo.cart !== cart)
      setCart(userInfo.cart);
  }, [userInfo.cart]);

  return (
    <>
      <div>
        <div
          className={`flex items-center justify-center cursor-pointer size-8 md:size-8 mt-1 hover:bg-slate-500 hover:bg-opacity-25 p-6 rounded-full lg:hidden  `}
          title={showSidebar ? "Close" : "Menu"}
          onClick={() => {
            setShowSidebar(!showSidebar);
            setShowLogin(false);
          }}
        >
          <svg
            className="flex-shrink-0"
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="24px"
            height="24px"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M21 5.25H3M21 12H3m18 6.75H3"
            ></path>
          </svg>
        </div>
        <AnimatePresence>
          {showSidebar && (
            <div className="z-[100] bg-bgBase2 text-textDark">
              <motion.div
                className="w-full right-0 -top-[2rem] bg-bgBlack/35 fixed h-[110vh] z-100 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3, // Applies to initial and animate by default
                }}
                onClick={() => {
                  setShowSidebar(false);
                }}
              ></motion.div>
              <motion.ul
                className="fixed left-0 pt-8 top-0 w-[22rem] h-full bg-bgBase px-4 text-xl "
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "0", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.15,
                }}
              >
                <div className="relative flex flex-col gap-4 h-full">
                  {" "}
                  <div
                    className={`-top-1 text-textDark cursor-pointer hover:bg-slate-500 hover:bg-opacity-25 p-2 rounded-full lg:hidden transition-all duration-300 absolute right-4 flex aspect-square w-fit`}
                    title={"Close"}
                    onClick={() => setShowSidebar(false)}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      viewBox="0 0 24 24"
                      role="img"
                      width="24px"
                      height="24px"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
                      ></path>
                    </svg>
                  </div>
                  {loggedIn ? (
                    <div
                      className="text-2xl text-bgExtraSecondaryLight cursor-pointer hover:text-bgExtraSecondaryLight/60"
                      onClick={() => nav("/profile")}
                    >
                      {userInfo.firstName
                        ? ` Welcome, ${userInfo.firstName}`
                        : ` Welcome, User`}
                    </div>
                  ) : (
                    <div className="mt-10 flex flex-col gap-2 pb-4 w-[20rem]">
                      <p> Become a Member or Login Today</p>
                      <div className="flex flex-row gap-2">
                        <button
                          className="w-fit rounded-full px-4 py-2 bg-bgSecondary text-textLight text-base hover:bg-bgSecondary/95"
                          onClick={() => {
                            setShowLogin("create");
                            setShowSidebar(false);
                          }}
                        >
                          Join Us
                        </button>
                        <button
                          className="w-fit rounded-full px-4 py-2 bg-bgBase text-textDark outline outline-1 outline-gray-400 hover:bg-bgSecondary/5 text-base"
                          onClick={() => {
                            setShowLogin("login");
                            setShowSidebar(false);
                          }}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  )}
                  <ul className="flex flex-col">
                    {" "}
                    {sectionElements &&
                      sectionElements.map((section) => {
                        return (
                          <li
                            key={section.key}
                            className="text-lg border-b py-2 mr-4"
                          >
                            {section}
                          </li>
                        );
                      })}
                  </ul>
                  <div className="h-full flex-shrink flex gap-3 sm:gap-4 items-end justify-between w-full box-border left-0 px-8 pb-1">
                    <SearchButton setSearch={setIsSearching} />
                    <Cart />
                    <ProfileButton
                      setShowLogin={setShowLogin}
                      showLogin={showLogin}
                      setShowSidebar={setShowSidebar}
                    />
                  </div>
                  <SearchBar
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    setSideBarVisible={setShowSidebar}
                  />
                </div>
              </motion.ul>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Sidebar;

{
  /* <div className="">
{cart && (
  <div className="w-full">
    <h1 className="font-medium text-3xl mb-4 flex-shrink-0">
      Cart
    </h1>
    <ul
      className={`flex flex-col gap-2 overflow-y-auto  flex-1 flex-shrink-1`}
      style={{
        maxHeight: `calc(100vh - 200px - ${
          (sections ? sections.length + 1 : 1) * 95
        }px)`, // Dynamically calculate max-height
      }}
    >
      {" "}
      {loading ? (
        <div className="loader mx-auto my-[4rem]"></div>
      ) : (
        products &&
        products.map((product, index) => {
          const cartItem = cart[index]; // Corresponding cart item

          if (!cartItem) return null; // Ensure cartItem exists before proceeding

          return (
            <CartItem
              key={cartItem.sku}
              sku={cartItem.sku}
              imageLink={product.imageLink}
              productName={product.productName}
              quantity={cartItem.quantity}
              price={product.price}
              discount={product.discount}
              color={product.color}
              type={product.type}
              size={product.size}
              description={product.description}
              sidebar={true}
            />
          );
        })
      )}
    </ul>
    <hr className="border-t-2 p-2" />
    <div className="flex flex-col gap-2">
      {" "}
      <CartSummaryHeader
        mainText={"Subtotal"}
        value={subtotalCost}
        zeroText={"Free"}
        loading={loading}
      />
      <CheckoutButton
        cart={cart ? cart : null}
        products={products}
      />
    </div>
  </div>
)}
</div> */
}

// cart in sidebar implementation **scrapped
