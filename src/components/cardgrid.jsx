import Card from "./card";
import { useState, useContext } from "react";
import { ProductContext } from "./utilities/ContextManager";

const CardGrid = () => {
  const { products } = useContext(ProductContext);
  const numProducts = products.length;

  const [showNum, setShowNum] = useState(1);

  const productCards = products.map((product) => {
    return (
      <Card
        key={product.id}
        id={product.id}
        colors={product.colors}
        name={product.productName}
        price={product.price}
        type={product.type}
        numPatterns={product.colors.length}
        discount={product.discount}
      />
    );
  });

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-8">
        {productCards}
      </div>
      <p className="text-sm lg:text-base relative left-full -translate-x-[11rem]">
        Showing {showNum} out of {numProducts}
      </p>
    </>
  );
};

export default CardGrid;
