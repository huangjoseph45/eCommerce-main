import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="group flex flex-row cursor-pointer m-auto gap-2 h-[2rem]"
    >
      <h2 className="select-none text-2xl">Imagine</h2>
      <h2 className="select-none text-2xl">Collective</h2>
    </Link>
  );
};

export default Logo;
