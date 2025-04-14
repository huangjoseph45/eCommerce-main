import { useEffect, useState } from "react";
import returnProduct from "../utilities/returnProduct";
import useCreateProduct from "../utilities/useCreateProduct";
import ArrayGrid from "./arrayGrid";
import SingleInput from "./singleInput";
import ColorGrid from "./colorGrid";
import ImageGrid from "./ImageGrid";
import useDeleteProduct from "../utilities/useDeleteProduct";

const EditProduct = ({ productFunction, product, setProduct }) => {
  const {
    loadingProductsCreation,
    errorMessage,
    newProduct,
    createProduct,
    setErrorMessage,
  } = useCreateProduct();
  const { error, loading, deleteProduct } = useDeleteProduct();
  const [imageCreationState, setImageCreationState] = useState(false);
  const [formData, setFormData] = useState(null);
  const [confirmationField, setConfirmationField] = useState();
  const [fileArray, setFileArray] = useState([]);
  const [deletionResult, setDeletionResult] = useState(false);

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

  const handleSubmit = async () => {
    if (productFunction === 0 && (product?.sku || formData?.sku)) {
      createProduct(formData, false, false, fileArray);
    } else if (productFunction === 1 && product?.sku) {
      createProduct(formData, false, true, fileArray);
    } else if (
      productFunction === 2 &&
      product?.sku &&
      confirmationField.toLowerCase() === "delete"
    ) {
      setDeletionResult(await deleteProduct(formData.sku));
      return;
    } else if (productFunction !== 0) {
      const found = await returnProduct(formData.sku);
      if (found) setProduct(found);
      else {
        setErrorMessage("Product could not be found");
      }
    }
  };

  useEffect(() => {
    if (newProduct || deletionResult) window.location.reload();
  }, [newProduct, deletionResult]);

  useEffect(() => {
    setErrorMessage("");
  }, [productFunction]);

  const onChange = (e, field) => {
    if (field === "delete") {
      setConfirmationField(e.target.value);
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  return (
    <div className="border relative">
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
                    imageCreationState={imageCreationState}
                  />{" "}
                  {!imageCreationState ? (
                    <div className="flex flex-row gap-4 items-center">
                      <button
                        className="p-2 outline hover:bg-bgBlack/10"
                        onClick={() => {
                          const colors = formData.colors.filter(
                            (color) =>
                              color.idMod && color.colorName && color.colorCode
                          );
                          setFormData({ ...formData, colors: colors });

                          setImageCreationState(true);
                        }}
                      >
                        Add Images
                      </button>
                      <p>
                        Do this after finishing colors. Note: images are
                        separated by products AND color
                      </p>
                    </div>
                  ) : (
                    <ImageGrid
                      colors={formData.colors}
                      formData={formData}
                      setFormData={setFormData}
                      fileArray={fileArray}
                      setFileArray={setFileArray}
                      sku={formData?.sku}
                    />
                  )}
                </>
              )}
            </>
          )}
        </ul>
      </div>
      {productFunction === 2 && product?.productName && (
        <>
          <div className="top-0 w-full h-[86%] bg-bgBlack/10 absolute "></div>
          <div className="mx-4 mb-4 mt-12 flex flex-col gap-2">
            <label htmlFor="sku">Confirm Deletion:</label>
            <input
              placeholder={'Type "Delete" to Confirm'}
              name="sku"
              type="text"
              className="rounded-sm bg-bgBase2 outline p-1 w-[12rem]"
              onChange={(e) => onChange(e, "delete")}
            />
          </div>
        </>
      )}
      <button
        onClick={() => handleSubmit()}
        className="outline p-2 mx-4 mb-2 hover:bg-gray-200"
      >
        {product?.sku ? "Submit" : "Find Product"}
      </button>

      {(errorMessage?.length > 0 || error?.length > 0) && (
        <p className="text-errorTrue">*{errorMessage ? errorMessage : error}</p>
      )}

      {product?.sku && (
        <p className="text-textHollow">
          Note: you cannot go back after pressing next
        </p>
      )}
    </div>
  );
};

export default EditProduct;
