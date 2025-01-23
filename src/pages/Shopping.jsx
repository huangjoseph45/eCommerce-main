import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/cardgrid";

import "../index.css";

function Shopping() {
  return (
    <>
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto">
        <Header />
        <CardGrid />
      </div>
      <Footer></Footer>
    </>
  );
}

export default Shopping;
