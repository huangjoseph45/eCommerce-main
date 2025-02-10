import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchOrder from "../components/utilities/useFetchOrder";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("q");
  const [isLoading, orderData, handleFetch] = useFetchOrder();

  console.log(orderId);
  const [timer, setTimer] = useState();
  useEffect(() => {});
  return (
    <div className="">
      <Header></Header>
      {isLoading ? <p>Loading...</p> : orderId}
      <Footer></Footer>
    </div>
  );
};

export default SuccessPage;
