import Header from "../components/header";
import Footer from "../components/footer";
import "../index.css";

const NoPage = () => {
  return (
    <>
      <Header> </Header>{" "}
      <a
        className="text-6xl flex items-center justify-center h-[20rem]"
        href="/"
        rel="noopener noreferrer"
      >
        404 Page Not Found
      </a>
      <Footer />
    </>
  );
};

export default NoPage;
