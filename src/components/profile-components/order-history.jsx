import useFetchProducts from "../utilities/useFetchMultipleProducts";
import { AnimatePresence, motion } from "motion/react";

const orders = [
  {
    productName: "Fancy Polo",
    sku: "SKU-1",
    type: "Men's Clothing",
    size: "M",
    color: {
      colorName: "navy",
      colorCode: "#18d67d",
      idMod: "nav",
    },
    finalPrice: 70,
    dateOrdered: Date.now(),
    statusText: "Shipped",
    isOk: true,
    fulfilled: false,
  },
  {
    productName: "Fancy Polo",
    sku: "SKU-1",
    type: "Men's Clothing",
    size: "M",
    color: {
      colorName: "white",
      colorCode: "#ffffff",
      idMod: "whi",
    },
    finalPrice: 70,
    dateOrdered: Date.now(),
    statusText: "Shipped",
    isOk: true,
    fulfilled: false,
  },
];

const OrderHistory = () => {
  const orderList = orders.map((order) => {
    const {
      productName,
      sku,
      type,
      size,
      color,
      finalPrice,
      dateOrdered,
      statusText,
      isOk,
      fulfilled,
    } = order;

    const imageLink = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
      sku + "-" + color.idMod
    }`;

    return (
      <li
        key={sku + "-" + dateOrdered + color.colorCode}
        className="flex gap-3 h-fit hover:shadow-md cursor-pointer transition-all duration-200"
      >
        <img
          src={imageLink}
          alt={productName}
          className="aspect-square object-cover h-[10rem]"
        />
        <div className="flex flex-col h-[10rem] justify-between box-border p-2">
          <div className="flex flex-col">
            {" "}
            <p
              className={`whitespace-nowrap capitalize text-lg font-semibold font-sans ${
                statusText?.toLowerCase().trim() === "shipped" && isOk
                  ? "text-green-700"
                  : isOk
                  ? "text-black"
                  : "text-red-700"
              }`}
            >
              {isOk ? statusText : "Error: Contact Support"}
            </p>
            <p className="whitespace-nowrap capitalize text-lg">
              {productName}
            </p>
          </div>
          <div className="flex flex-col">
            {" "}
            <p className="whitespace-nowrap capitalize text-gray-500">{type}</p>
            <p
              className={`whitespace-nowrap capitalize text-black  cursor-pointer`}
            >
              {color.colorName}
            </p>
            <p className="whitespace-nowrap capitalize ">{size}</p>
          </div>
        </div>
      </li>
    );
  });
  return (
    <AnimatePresence>
      <motion.ul
        initial={{ opacity: 0.5, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-3"
      >
        {orderList}
      </motion.ul>
    </AnimatePresence>
  );
};

export default OrderHistory;
