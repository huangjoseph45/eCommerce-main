import { useEffect, useState } from "react";
import useFetchTopProducts from "./utilities/useFetchTopProducts";
import parsePrice from "./utilities/parsePrice";
import { useNavigate } from "react-router-dom";

const numProductsPerTag = 10;

const AdditionalProducts = ({ tags, ignoreSKUList }) => {
  const nav = useNavigate();
  const [loading, products, getProducts] = useFetchTopProducts();
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    if (tags && tags.length > 0) {
      getProducts({
        enableTest: false,
        tagArray: tags,
        numProductsPerTag: numProductsPerTag,
        strictSelection: false,
      });
    }
  }, [tags]);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products
          .filter((product) => !ignoreSKUList.includes(product.sku))
          .sort((a, b) => b.clicks - a.clicks)
      );
    }
  }, [products]);

  return (
    <div className="md:mt-16 mx-4 lg:mx-6">
      <h1 className="text-2xl py-2">You Might Also Like</h1>
      <ul className="flex flex-row gap-2 overflow-x-scroll scrollbar-hide">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const { initialPrice, finalPrice } = parsePrice(
              product.price,
              product.discount
            );

            const stringURL = `/p/${encodeURIComponent(
              product.productName.replace(/ /g, "-")
            ).toLowerCase()}/${encodeURIComponent(product.sku)}/${
              product.colors[0].idMod
            }`;

            return (
              <div
                onClick={() => nav(stringURL)}
                key={product._id}
                className="flex-shrink-0 mb-4 cursor-pointer w-[12rem] md:w-[14rem] lg:w-[18rem] xl:w-[22rem]"
              >
                <img
                  src={`https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                    product.sku + "-" + product.colors[0].idMod
                  }`}
                  alt=""
                  className="aspect-square object-cover w-full "
                />
                <h2 className="mt-3 text-lg  leading-tight">
                  {product.productName}
                </h2>
                <h3 className="text-textHollow ">{product.type}</h3>

                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold text-lg">${finalPrice}</p>
                  {product.discount !== 0 && (
                    <p className="font-semibold text-md line-through text-gray-500">
                      ${initialPrice}
                    </p>
                  )}
                </div>
                {product.discount !== 0 && (
                  <p className="font-medium text-lg text-errorFalse">
                    {product.discount}% off
                  </p>
                )}
              </div>
            );
          })
        ) : !loading ? (
          <p>No Products Found</p>
        ) : (
          <div className="mx-auto my-8 loader"></div>
        )}
      </ul>
    </div>
  );
};

export default AdditionalProducts;
