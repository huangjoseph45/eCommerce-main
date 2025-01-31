import Header from "../components/header";
import Footer from "../components/footer";
import CardGrid from "../components/cardgrid";

import "../index.css";

function Shopping() {
  return (
    <>
      {" "}
      <Header />
      <div className="w-full lg:w-[90%] xl:w-[80%] mx-auto">
        <CardGrid />
      </div>
      <Footer></Footer>
    </>
  );
}

export default Shopping;
