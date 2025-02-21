import Card from "./card";
import { useState } from "react";
import CardPlaceHolder from "./cardPlaceholder";

const CardGrid = ({ isLoading, products }) => {
  const [showNum, setShowNum] = useState(1);

  // Ideas for cursor based pagination:
  // Get index for products returned from db
  // when at end of current products list, get more products starting from index
  // need these new parameters: index, numProductsToGet, isEnd
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-8 relative">
        {!isLoading && products
          ? products.map((product, index) => {
              return (
                <Card
                  key={product.sku + index + product._id}
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
          : isLoading && (
              <>
                {[...Array(8)].map((_, index) => (
                  <CardPlaceHolder key={index} />
                ))}
              </>
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
