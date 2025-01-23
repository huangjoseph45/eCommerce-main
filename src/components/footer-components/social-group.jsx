import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SocialGroup = ({ text, icon, href, hiColor }) => {
  return (
    <a
      className={`group text-black flex gap-1 items-center justify-center w-fit hover:text-${hiColor} transition-all duration-200`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon className="my-auto" icon={icon} />
      <p>{text}</p>
    </a>
  );
};

export default SocialGroup;
