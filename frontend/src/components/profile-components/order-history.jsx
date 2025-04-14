import { useRef, useContext, useEffect, useState } from "react";
import useFetchServerData from "../utilities/getDataFromServer";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import useFetchOrder from "../utilities/useFetchOrder";
import { debounce } from "lodash";
import { ProductContext } from "../utilities/ContextManager";

const OrderHistory = () => {
  const { data, refetch } = useFetchServerData();
  const [isLoading, orderData, handleFetch] = useFetchOrder();
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const [showPurchases, setShowPurchases] = useState([]);
  const fetched = useRef(false);
  const nav = useNavigate();

  const debouncedFetch = debounce((orders) => {
    handleFetch(orders);
  }, 10);

  useEffect(() => {
    refetch({ queries: ["orders"], auth: true });
  }, []);

  useEffect(() => {
    if (
      data &&
      data.orders &&
      data.orders.length > 0 &&
      !orderData &&
      !fetched.current
    ) {
      debouncedFetch(data.orders);
      fetched.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (orderData && orderData.length > 0 && userInfo.orderData !== orderData) {
      setUserInfo({ ...userInfo, orders: orderData });
      setShowPurchases(
        orderData.map(() => {
          return false;
        })
      );
    }
  }, [orderData]);

  return (
    <AnimatePresence>
      <motion.ul className="flex flex-col gap-3 ">
        {orderData && orderData.length > 0 ? (
          orderData.map((order, index) => {
            if (!order) return;
            const { shippingInfo, userInfo, productInfo } = order;
            return (
              <li
                key={order._id}
                className="flex gap-3 shadow-md cursor-pointer transition-all duration-200 hover:bg-bgBlack/[2%] w-full"
              >
                <div className="flex flex-col box-border w-full">
                  <div
                    className="flex flex-col w-full text-xs bg-bgSecondaryLight p-2 text-textLight rounded-t-md"
                    onClick={() => {
                      setShowPurchases((prev) =>
                        prev.map((item, i) => (i === index ? !item : item))
                      );
                    }}
                  >
                    <p
                      className={`whitespace-nowrap capitalize text-lg font-semibold font-sans  ${
                        order.status === "processing"
                          ? "text-textLight"
                          : order.status === "shipped" ||
                            order.status === "delivered" ||
                            order.status === "returned"
                          ? "text-errorFalse"
                          : order.status === "canceled"
                          ? "text-errorTrue"
                          : "text-textLight"
                      }`}
                    >
                      {order.status}
                    </p>
                    <div className="flex flex-row w-full pr-4 relative ">
                      <p
                        className={`whitespace-nowrap capitalize text-textLight  cursor-pointer`}
                      >
                        {shippingInfo.name}
                      </p>
                      <div className="absolute top-0 right-4 flex flex-col gap-1">
                        <button
                          className="hover:underline"
                          onClick={() => nav(`/order?q=${order._id}`)}
                        >
                          View Order Summary
                        </button>{" "}
                        {order.createdAt && (
                          <p className="whitespace-nowrap capitalize text-gray-300">
                            {new Date(order.createdAt).toDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="lg:whitespace-nowrap capitalize flex flex-col lg:flex-row">
                      <p>{shippingInfo.address.line1},&nbsp;</p>
                      <p> {shippingInfo.address.city} </p>
                    </p>
                  </div>{" "}
                  <AnimatePresence>
                    {showPurchases[index] === true && productInfo && (
                      <motion.ul
                        initial={{ opacity: 0.95, height: 0, top: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          overflow: "hidden",
                        }}
                        exit={{ opacity: 0.95, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={` flex flex-col px-4 gap-2`}
                      >
                        {productInfo.map((product) => {
                          const imageLink = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                            product.sku.toUpperCase() +
                            "-" +
                            product.color.idMod
                          }`;
                          return (
                            <li
                              key={product._id}
                              className="flex flex-row gap-2 hover:bg-bgBlack/[3%] rounded-lg h-fit my-2 p-2"
                            >
                              <div className="aspect-square h-[7rem] rounded-lg">
                                <img
                                  src={imageLink}
                                  alt=""
                                  className="aspect-square object-cover rounded-sm shadow-md"
                                />
                              </div>
                              <div className="flex flex-col ">
                                <p className="capitalize text-lg">
                                  {product.name}
                                </p>
                                <p className="capitalize text-sm">
                                  $
                                  {(
                                    product.paymentInfo.unit_amount / 100
                                  ).toFixed(2)}
                                </p>
                                <p className="capitalize text-sm">
                                  Color: {product.color.colorName}
                                </p>
                                <p className="capitalize text-sm">
                                  Size: {product.size}
                                </p>
                                <p className="capitalize text-sm">
                                  Quantity: {product.quantity}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}{" "}
                  </AnimatePresence>
                  <div
                    className="flex flex-row w-full text-lg bg-bgSecondaryLight p-2 text-textLight rounded-b-md justify-between outline-t outline-t-bgSecondaryLight"
                    onClick={() => {
                      setShowPurchases((prev) =>
                        prev.map((item, i) => (i === index ? !item : item))
                      );
                    }}
                  >
                    <p>
                      $
                      {(
                        productInfo.reduce((total, currentValue) => {
                          return (
                            total +
                            currentValue.paymentInfo.unit_amount *
                              currentValue.quantity
                          );
                        }, 0) / 100
                      ).toFixed(2)}
                    </p>
                    <p className="text-[0.5rem]">Order #: {order._id}</p>
                  </div>
                </div>
              </li>
            );
          })
        ) : !isLoading ? (
          <p>No Orders Found</p>
        ) : (
          <div className=" absolute top-1/3 left-1/2 -translate-x-1/2">
            {" "}
            <p className="loader "></p>
          </div>
        )}
      </motion.ul>
    </AnimatePresence>
  );
};

export default OrderHistory;
