import { useEffect, useState } from "react";
import returnProduct from "../utilities/returnProduct";
import useCreateProduct from "../utilities/useCreateProduct";
import ArrayGrid from "./arrayGrid";
import SingleInput from "./singleInput";
import ColorGrid from "./colorGrid";

const EditProduct = ({ productFunction, product, setProduct }) => {
  const { loadingProductsCreation, errorMessage, newProduct, createProduct } =
    useCreateProduct();

  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    console.log(newImages);
  }, [newImages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (product?.sku || productFunction === 0) {
      if (productFunction === 0) {
        createProduct(data);
      } else if (productFunction === 1) {
        return;
      } else if (productFunction === 2) {
        return;
      }
    } else {
      const found = await returnProduct(data.sku);
      setProduct(found);
    }
  };
  console.log(product);
  return (
    <form onSubmit={handleSubmit} className="">
      <div className="p-2">
        <h1 className="font-medium">
          {productFunction === 0
            ? "Create Product"
            : productFunction === 1
            ? "Modify Product"
            : productFunction === 2
            ? "Delete Product"
            : ""}
        </h1>
        <ul className="flex-col flex gap-3 p-2">
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="sku">SKU:</label>
            <input
              name="sku"
              type="text"
              className="rounded-sm bg-bgBase2 outline p-1"
            />
          </div>
          {(productFunction === 0 || product?.sku) && (
            <>
              <SingleInput
                label={"Product Name"}
                product={product}
                field={"productName"}
              />
              <SingleInput
                label={"General Category"}
                product={product}
                field={"type"}
              />{" "}
              <SingleInput label={"Price"} product={product} field={"price"} />
              <SingleInput
                label={"Discount"}
                product={product}
                field={"discount"}
              />
              <div className="flex flex-row gap-2">
                <label htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  type="text"
                  className="rounded-sm bg-bgBase2 outline p-1 w-[15rem] md:w-[20rem] lg:w-[30rem] xl:w-[40rem]"
                  rows={6}
                  defaultValue={product?.description}
                ></textarea>
              </div>
              <ArrayGrid
                arrayLabel="Tags"
                itemArray={product?.tags}
                setProduct={setProduct}
                product={product}
                setter={"tags"}
              />
              <ArrayGrid
                arrayLabel="Sizes"
                itemArray={product?.sizes}
                setProduct={setProduct}
                product={product}
                setter={"sizes"}
              />
              <ColorGrid
                product={product}
                setProduct={setProduct}
                newImages={newImages}
                setNewImages={setNewImages}
              />
            </>
          )}
        </ul>
      </div>
      <button type="submit" className="outline p-2 mx-4 mb-2 hover:bg-gray-200">
        {product?.sku ? "Submit" : "Find Product"}
      </button>
    </form>
  );
};

export default EditProduct;
