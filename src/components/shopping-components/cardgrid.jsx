import Card from "./card";
import { useState } from "react";
import CardPlaceHolder from "./cardPlaceholder";

const CardGrid = ({ isLoading, products }) => {
  const [showNum, setShowNum] = useState(1);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-8 relatives">
        {!isLoading && products ? (
          products.map((product) => {
            return (
              <>
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
                <Card
                  key={product.sku}
                  sku={product.sku}
                  colors={product.colors}
                  name={product.productName}
                  price={product.price}
                  type={product.type}
                  numPatterns={product.colors.length}
                  discount={product.discount}
                />
              </>
            );
          })
        ) : (
          <>
            <CardPlaceHolder key={1} />
            <CardPlaceHolder key={2} />
            <CardPlaceHolder key={3} />
            <CardPlaceHolder key={4} />
            <CardPlaceHolder key={5} />
            <CardPlaceHolder key={6} />
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
