import Header from "../components/header";
import Footer from "../components/footer";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUpdateServerData from "../components/utilities/updateServerData";
import { ProductContext } from "../components/utilities/ContextManager";
import { useSearchParams } from "react-router-dom";
import useFetchOrder from "../components/utilities/useFetchOrder";
import ShippingDetails from "../components/success-components/shippingDetails";
import OrderDetails from "../components/success-components/orderDetails";

const SuccessPage = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, orderData, handleFetch] = useFetchOrder();
  const orderId = useRef();
  const sessionId = useRef();
  const totalPrice = useRef();
  const [displayPrice, setDisplayPrice] = useState();
  useEffect(() => {
    if (totalPrice.current !== displayPrice) {
      setDisplayPrice(totalPrice.current);
    }
  }, [totalPrice.current]);

  useEffect(() => {
    orderId.current = searchParams.get("q");
    sessionId.current = searchParams.get("session_id");

    handleFetch([orderId.current]);
  }, [searchParams, sessionId]);

  useEffect(() => {
    if (orderData) {
      totalPrice.current = orderData[0].productInfo.reduce((acc, product) => {
        return acc + product.paymentInfo.unit_amount * product.quantity;
      }, 0);
    }
  }, [orderData]);

  return (
    <div className="">
      <Header></Header>
      <div className="w-[95%] md:w-3/4 lg:w-[60%] mx-auto mt-8">
        {" "}
        <p className="text-3xl">Order Details</p>
        {isLoading ? (
          <div className="h-[50vh]">
            {" "}
            <p className="loader absolute top-1/3 left-1/2 -translate-x-1/2"></p>
          </div>
        ) : orderData && orderData[0] ? (
          <>
            <div className="flex flex-row justify-between p-4 border rounded-md shadow-md my-4 text-xs lg:text-base">
              <ShippingDetails orderData={orderData[0]} />
              <OrderDetails orderData={orderData[0]} />
            </div>

            <div className="flex flex-col justify-between p-4 border rounded-md shadow-md my-4 gap-2">
              {orderData &&
                orderData[0] &&
                orderData[0].productInfo.map((product, index) => {
                  const imageLink = `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
                    product.sku.toUpperCase() + "-" + product.color.idMod
                  }`;
                  const stringURL = (
                    "p/" +
                    encodeURIComponent(product.name.replace(/ /g, "-")) +
                    "/" +
                    product.sku
                  ).toLowerCase();

                  return (
                    <li
                      key={product._id}
                      className="list-none flex flex-row gap-2 justify-between w-full"
                    >
                      <div
                        className="flex gap-4 cursor-pointer"
                        onClick={() => nav(`/${stringURL}`)}
                      >
                        <img
                          src={imageLink}
                          alt=""
                          className="aspect-[3/4] object-cover rounded-sm shadow-md h-[9rem]"
                        />
                        <div className="flex flex-col">
                          <p className="">{product.name}</p>
                          <p className="">
                            $
                            {(product.paymentInfo.unit_amount / 100).toFixed(2)}
                          </p>
                          <p className="capitalize">Size: {product.size}</p>
                          <p className="capitalize">
                            Color: {product.color.colorName}
                          </p>
                          <p className="capitalize">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="uppercase px-8">
                        <p>{product.sku}</p>
                      </div>
                    </li>
                  );
                })}
            </div>
            <div className="flex flex-col justify-between p-4 border rounded-md shadow-md my-4 gap-2">
              Total: ${(displayPrice / 100).toFixed(2)}
            </div>
          </>
        ) : (
          <p>No Data Found</p>
        )}
      </div>

      <Footer></Footer>
    </div>
  );
};

export default SuccessPage;
