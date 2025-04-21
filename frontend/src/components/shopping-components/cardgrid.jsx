import Card from "./card";
import { useEffect, useRef, useState } from "react";
import CardPlaceHolder from "./cardPlaceholder";

const CardGrid = ({ isLoading, products }) => {
  const [showNum, setShowNum] = useState(1);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (!products || products.length < 1 || !products[0].sku) {
      setTimeout(() => {
        setMessageVisible(true);
      }, 100);
    } else {
      setMessageVisible(false);
    }
  }, [products]);

  // Ideas for cursor based pagination:
  // Get index for products returned from db
  // when at end of current products list, get more products starting from index
  // need these new parameters: index, numProductsToGet, isEnd
  return (
    <>
      <div
        className={`${
          isLoading || (products && products.length > 0 && products[0].sku)
            ? "grid grid-cols-2 md:grid-cols-3"
            : null
        } gap-4 w-full mx-8 2xl:mx-14 relative`}
      >
        {isLoading ? (
          <>
            {[...Array(products?.length || 8)].map((_, index) => (
              <CardPlaceHolder key={index} />
            ))}
          </>
        ) : products && products.length > 0 && products[0].sku ? (
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
        ) : (!products || products.length < 1 || !products[0].sku) &&
          messageVisible ? (
          <div className="h-[10rem] medium">
            <p className="mx-auto items-center flex justify-center text-4xl mt-4 w-fit">
              We could not find anything
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CardGrid;
