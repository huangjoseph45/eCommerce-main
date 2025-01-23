import { button } from "motion/react-client";
import "../index.css";

const NoPage = () => {
  return (
    <a
      className="text-6xl absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
      href="/"
      rel="noopener noreferrer"
    >
      404 Page Not Found
    </a>
  );
};

export default NoPage;
