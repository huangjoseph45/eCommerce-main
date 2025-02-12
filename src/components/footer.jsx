import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import SocialGroup from "./footer-components/social-group";

const Footer = () => {
  return (
    <div className="bg-bgBase w-full">
      <div className=" mx-auto w-2/3 h-fit pt-10 pb-[4rem] mt-[6rem] flex flex-row justify-around items-start border-t border-t-black ">
        <div className="flex flex-col gap-2">
          <SocialGroup
            text="Github"
            icon={faGithub}
            href="https://github.com/huangjoseph45/eCommerce"
            hiColor="purple-300"
          />
          <SocialGroup
            text="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/imagine_collectiive/"
            hiColor="amber-400"
          />
        </div>
      </div>
    </div>
  );
};
export default Footer;
