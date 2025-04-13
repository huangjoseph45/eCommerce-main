import { useContext, useEffect, useState } from "react";
import EditProduct from "../components/admin-components/editProduct";
import { AuthContext } from "../components/utilities/ContextManager";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [currentFunction, setCurrentFunction] = useState();
  const nav = useNavigate();
  const [authValues, setAuthValues] = useState({
    hasSession: false,
    role: null,
  });
  const [foundData, setFoundData] = useState({
    sku: "",
    colors: [{ colorName: "", idMod: "", colorCode: "", numImages: 0 }],
    description: "",
    discount: 0,
    price: 0,
    productName: "",
    sizes: [""],
    tags: [""],
    type: "",
  });
  const [showDevPage, setShowDevPage] = useState(true);
  useEffect(() => {
    const endpoint = `${import.meta.env.VITE_PATH}/users/auth-status`;
    const handleAuth = async () => {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setAuthValues(data);
      if (!data.hasSession || data.role !== "admin") {
        nav("/");
      }
    };
    handleAuth();
  }, [window.location]);

  const resizeFunc = () => {
    setShowDevPage(window.innerWidth > 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeFunc);

    return () => window.removeEventListener("resize", resizeFunc);
  }, []);

  const developerFunctions = [
    { functionName: "Create Product", func: 0 },
    { functionName: "Modify Product", func: 1 },
    { functionName: "Delete Product", func: 2 },
    { functionName: "Create Section", func: 3 },
    { functionName: "Modify Section", func: 4 },
    { functionName: "Delete Section", func: 5 },
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-2">Admin Page</h1>
      {showDevPag && authValues.hasSession && authValues.role === "admin" ? (
        <div className="flex flex-row">
          <div className="w-[10rem] flex-shrink-0 mx-auto ">
            <h2 className="text-xl">Functions</h2>
            <ul className="">
              {developerFunctions.map((f) => {
                return (
                  <li
                    className=" cursor-pointer hover:underline list-item list-decimal"
                    key={f.functionName}
                    onClick={() => {
                      setCurrentFunction(f.func);
                      setFoundData({
                        sku: "",
                        colors: [],
                        description: "",
                        discount: 0,
                        price: 0,
                        productName: "",
                        sizes: [""],
                        tags: [""],
                        type: "",
                      });
                    }}
                  >
                    {f.functionName}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-full">
            {currentFunction === 0 ||
            currentFunction === 1 ||
            currentFunction === 2 ? (
              <EditProduct
                productFunction={currentFunction % 3}
                product={foundData}
                setProduct={setFoundData}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <h1>Please use a desktop</h1>
      )}
    </div>
  );
};

export default AdminPage;
