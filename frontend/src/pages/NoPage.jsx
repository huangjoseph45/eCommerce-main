import Header from "../components/header";
import Footer from "../components/footer";
import "../index.css";
import CardPlaceHolder from "../components/shopping-components/cardPlaceholder";
import { useEffect, useState } from "react";
import AdditionalProducts from "../components/additionalProducts";

const NoPage = () => {
  const [timer, setTimer] = useState(0.1);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setTimer(0);
    }, timer * 1000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <Header> </Header>{" "}
      {timer <= 0 ? (
        <div className=" flex flex-col items-center justify-center h-[20rem] my-12 w-[90%] mx-auto rounded-3xl bg-bgBase3 gap-8">
          <p className="text-5xl font-medium">404 Page Not Found</p>{" "}
          <a
            className="cursor-pointer text-2xl outline outline-bgSecondary hover:text-textLight transition-all duration-150 px-4 py-2 rounded-full hover:bg-bgSecondary"
            href="/"
            rel="noopener noreferrer"
          >
            Return to Home Page
          </a>
        </div>
      ) : (
        <div className="top-[3rem] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-8 relative">
          <CardPlaceHolder key={1} />
          <CardPlaceHolder key={2} />
          <CardPlaceHolder key={3} />
          <CardPlaceHolder key={4} />
          <CardPlaceHolder key={5} />
          <CardPlaceHolder key={6} />
          <CardPlaceHolder key={7} />
          <CardPlaceHolder key={8} />
        </div>
      )}
      <div className="md:gap-0 md:w-full mx-auto mt-6">
        <AdditionalProducts tags={[""]} ignoreSKUList={[]} />
      </div>
      <Footer />
    </>
  );
};

export default NoPage;
