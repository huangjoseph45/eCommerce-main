import { useEffect, useState } from "react";

const OrderDetails = ({ orderData }) => {
  const [date, setDate] = useState("");
  useEffect(() => {
    if (orderData.createdAt) {
      const dateArray = new Date(orderData.createdAt).toDateString().split(" ");
      setDate(`${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`);
    }
  }, [orderData]);
  return (
    <div className="flex flex-col w-fit justify-center">
      <div className="flex flex-col ">
        <div className="relative flex">
          <p className="absolute text-[.5rem] top-1 lg:top-2 -translate-y-full">
            Order ID:
          </p>
          <p className="text">{orderData._id}</p>
        </div>
        {orderData.verified ? (
          <div className="text text-errorFalse font-medium">
            Order is verified
          </div>
        ) : (
          <div className="text text-errorTrue font-medium">
            Order is not verified
          </div>
        )}
        <div className="flex flex-row capitalize items-center gap-1">
          {" "}
          <p className="">Status: </p>
          <p className="">{orderData.status}</p>
        </div>

        {orderData.createdAt && (
          <div className="flex flex-row capitalize items-center gap-1">
            <p className="">Order Placed: </p>
            <p className="text">{date}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
