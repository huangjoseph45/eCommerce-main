import Header from "../components/header";
import Footer from "../components/footer";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUpdateServerData from "../components/utilities/updateServerData";
import { ProductContext } from "../components/utilities/ContextManager";

const SuccessPage = () => {
  const { userInfo, setUserInfo } = useContext(ProductContext);
  const nav = useNavigate();
  const [timer] = useState(3);
  const timeoutId = useRef();
  const { refetch } = useUpdateServerData({
    dataToUpdate: null,
  });

  useEffect(() => {
    refetch({ cart: [] });
    setUserInfo({ ...userInfo, cart: [] });
    timeoutId.current = setTimeout(() => {
      nav("/");
    }, timer * 1000);

    return () => clearTimeout(timeoutId.current);
  }, []);

  return (
    <div className="">
      <Header></Header>

      <div
        className="flex flex-col w-fit mx-auto p-4 cursor-pointer"
        onClick={() => nav("/")}
      >
        <p className="text-3xl">Order Successful!</p>
        <p className="text-sm items-center justify-center flex">
          Redirecting in {timer} seconds
        </p>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SuccessPage;
