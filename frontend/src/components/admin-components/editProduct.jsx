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
  const [error, setErrorMessage] = useState("");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setFormData({
      sku: product?.sku || "",
      colors: product?.colors
        ? product.colors
        : [{ colorName: "", idMod: "", colorCode: "", numImages: 0 }],
      description: product?.description || "",
      discount: product?.discount || 0,
      price: product?.price || 0,
      productName: product?.productName || "",
      sizes: product?.sizes || [""],
      tags: product?.tags || [""],
      type: product?.type || "",
    });
  }, [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (product?.sku) {
      const isFormOk =
        Object.entries(formData)?.filter((entry) => {
          if (entry[0] === "colors") {
            const checkColors = entry[1].filter((color) => {
              console.log(color.colorCode.length);
              return (
                !color.idMod ||
                !color.colorName ||
                color.colorCode?.length !== 7
              );
            });
            return checkColors.length > 0;
          }
          if (entry[0] === "sizes" || entry[0] === "tags") {
            const checkArrays = entry[1].filter((arrayItem) => {
              return !arrayItem || arrayItem.length === 0;
            });
            return checkArrays.length > 0;
          }
          return !entry[1] || entry[1].length === 0;
        }).length === 0;

      if (!isFormOk) {
        setErrorMessage("Missing Fields");
      }
      console.log(isFormOk);
    } else {
      const found = await returnProduct(formData.sku);
      setProduct(found);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

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
              onChange={(e) => onChange(e, "sku")}
            />
          </div>
          {(productFunction === 0 || product?.sku) && (
            <>
              <SingleInput
                label={"Product Name"}
                product={product}
                field={"productName"}
                changeFunc={onChange}
              />
              <SingleInput
                label={"General Category"}
                product={product}
                field={"type"}
                changeFunc={onChange}
              />{" "}
              <SingleInput
                label={"Price"}
                product={product}
                field={"price"}
                changeFunc={onChange}
                isNumber={true}
              />
              <SingleInput
                label={"Discount"}
                product={product}
                field={"discount"}
                changeFunc={onChange}
                isNumber={true}
              />
              <div className="flex flex-row gap-2">
                <label htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  type="text"
                  className="rounded-sm bg-bgBase2 outline p-1 w-[15rem] md:w-[20rem] lg:w-[30rem] xl:w-[40rem]"
                  rows={6}
                  defaultValue={product?.description}
                  onChange={(e) => onChange(e, "description")}
                ></textarea>
              </div>
              {formData && (
                <>
                  <ArrayGrid
                    arrayLabel="Tags"
                    itemArray={formData?.tags}
                    setProduct={setFormData}
                    product={formData}
                    field={"tags"}
                    setFormData={setFormData}
                    formData={formData}
                  />
                  <ArrayGrid
                    arrayLabel="Sizes"
                    itemArray={formData?.sizes}
                    setProduct={setFormData}
                    product={formData}
                    field={"sizes"}
                    setFormData={setFormData}
                    formData={formData}
                  />
                  <ColorGrid
                    product={formData}
                    setProduct={setFormData}
                    newImages={newImages}
                    setNewImages={setNewImages}
                  />
                </>
              )}
            </>
          )}
        </ul>
      </div>
      <button type="submit" className="outline p-2 mx-4 mb-2 hover:bg-gray-200">
        {product?.sku ? "Next" : "Find Product"}
      </button>

      {error?.length > 0 && <p className="text-errorTrue">*{error}</p>}
      <p className="text-textHollow">
        Note: you cannot go back after pressing next
      </p>
    </form>
  );
};

export default EditProduct;
