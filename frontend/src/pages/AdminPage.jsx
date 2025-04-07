import { useEffect, useState } from "react";
import EditProduct from "../components/admin-components/editProduct";

const AdminPage = () => {
  const [currentFunction, setCurrentFunction] = useState();
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
      {showDevPage ? (
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
