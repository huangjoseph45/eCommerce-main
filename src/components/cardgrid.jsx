import Card from "./card";
import { useState, useContext, useEffect } from "react";
import { ProductContext } from "./utilities/ContextManager";
import useFetchProducts from "./utilities/useFetchMultipleProducts";

const CardGrid = ({ isLoading, products }) => {
  const [showNum, setShowNum] = useState(1);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-8 relatives">
        {!isLoading && products ? (
          products.map((product) => {
            return (
              <Card
                key={product.id}
                sku={product.sku}
                colors={product.colors}
                name={product.productName}
                price={product.price}
                type={product.type}
                numPatterns={product.colors.length}
                discount={product.discount}
              />
            );
          })
        ) : (
          <p>Loading...</p>
        )}
        {isLoading && products && (
          <p className="text-sm lg:text-base absolute right-0 top-full p-2 whitespace-nowrap">
            Showing {showNum} out of {products.length}
          </p>
        )}
      </div>
    </>
  );
};

export default CardGrid;
