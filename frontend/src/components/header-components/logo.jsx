import { Link } from "react-router-dom";

const Logo = ({ invert = false, full = false }) => {
  const src = full
    ? "https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/logo-text-full1.png"
    : "https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/logo-text1.png";
  return (
    <Link
      to="/"
      className="group flex flex-row cursor-pointer m-auto gap-2 h-full justify-center"
    >
      <img
        src={src}
        alt=""
        className={`object-cover object-center ${invert && "invert"}`}
      />
    </Link>
  );
};

export default Logo;
