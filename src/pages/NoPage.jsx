import Header from "../components/header";
import Footer from "../components/footer";
import "../index.css";
import CardPlaceHolder from "../components/shopping-components/cardPlaceholder";
import { useEffect, useState } from "react";

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
        <a
          className="text-6xl flex items-center justify-center h-[20rem]"
          href="/"
          rel="noopener noreferrer"
        >
          <p>404 Page Not Found</p>
        </a>
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
      <Footer />
    </>
  );
};

export default NoPage;
