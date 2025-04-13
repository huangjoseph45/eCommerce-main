import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import SocialGroup from "./footer-components/social-group";
import Logo from "./header-components/logo";
import MailingListInput from "./mailingListInput";

const Footer = () => {
  return (
    <div className="text-textLight relative bg-bgDarkLight w-full">
      <div className=" mx-auto w-3/4 lg:w-2/3 min-h-[17.5rem] h-fit pt-[4rem] pb-[4rem] mt-[4rem] flex flex-row justify-around items-start">
        <div className="absolute left-8 w-48 top-[4rem]">
          <Logo invert={true} full={true} />
        </div>
        <div className="flex flex-col border-l pl-8 h-[10rem]">
          <h2 className="mb-4 gap-2">Get Help</h2>
          <a href="">FAQ</a>
          <a href="">Site Feedback</a>
          <a href="">Contact Us</a>
        </div>
        <div className="flex flex-col border-l pl-8 h-[10rem]">
          <h2 className="mb-4 gap-2">Company</h2>
          <a href="">About Us</a>
          <a href="">Terms of Use</a>
          <a href="">Privacy Policy</a>
          <SocialGroup
            text="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/imagine_collectiive/"
            hiColor="amber-400"
          />
        </div>
        <MailingListInput />
      </div>
      <div className="text-xs lg:text-s w-full bg-bgDark h-fit">
        <div className="p-4 flex flex-row text-textHollow">
          <p>© 2025, All Rights Reserved |&nbsp;</p>{" "}
          <a
            className="hover:underline"
            target="_blank"
            href="https://github.com/huangjoseph45/eCommerce-main"
          >
            Made with &hearts; by
          </a>
          <p className="text-bgTertiary">&nbsp;Joseph Huang</p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
