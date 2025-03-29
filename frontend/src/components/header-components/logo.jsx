import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="group flex flex-row cursor-pointer m-auto gap-2 h-full justify-center"
    >
      {/* <h2 className="select-none text-2xl">Imagine</h2>
      <h2 className="select-none text-2xl">Collective</h2> */}
      <img
        src="https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/logo-textonly"
        alt=""
        className="object-contain"
      />
    </Link>
  );
};

export default Logo;
