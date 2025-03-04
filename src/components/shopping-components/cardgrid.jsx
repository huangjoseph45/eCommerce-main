import Card from "./card";
import { useEffect, useRef, useState } from "react";
import CardPlaceHolder from "./cardPlaceholder";

const CardGrid = ({ isLoading, products }) => {
  const [showNum, setShowNum] = useState(1);

  // Ideas for cursor based pagination:
  // Get index for products returned from db
  // when at end of current products list, get more products starting from index
  // need these new parameters: index, numProductsToGet, isEnd
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full px-8 relative">
        {products && products.length > 0 && products[0].sku ? (
          products.map((product, index) => {
            return (
              <Card
                key={product.sku + index + product._id}
                sku={product.sku}
                colors={product.colors}
                name={product.productName}
                price={product.price}
                type={product.type}
                numPatterns={product.colors && product.colors.length}
                discount={product.discount}
                product={product}
              />
            );
          })
        ) : (!products || products.length < 1) && isLoading ? (
          <>
            {[...Array(8)].map((_, index) => (
              <CardPlaceHolder key={index} />
            ))}
          </>
        ) : (
          (!products || products.length < 1 || !products[0].sku) && (
            <div className="w-full h-[10rem]">
              <p className="mx-auto items-center flex justify-center text-4xl mt-4 absolute w-full">
                We could not find anything
              </p>
            </div>
          )
        )}
        {!isLoading && products && (
          <p className="text-sm lg:text-base absolute right-0 top-full p-2 whitespace-nowrap">
            {/* Showing {showNum} out of {products.length} */}
          </p>
        )}
      </div>
    </>
  );
};

export default CardGrid;
