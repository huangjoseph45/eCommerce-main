import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import SocialGroup from "./footer-components/social-group";
import Logo from "./header-components/logo";
import MailingListInput from "./mailingListInput";
import FooterCol from "./footer-components/footerCol";

const Footer = () => {
  return (
    <div className=" text-textLight  bg-bgDarkLight w-full">
      <div className="relative mx-auto w-full h-fit pt-[4rem] pb-[2rem] sm:pb-0 mt-[4rem] flex flex-col sm:flex-row justify-around items-start">
        <div className="hidden md:block left-8 md:w-36 lg:w-48 top-[4rem]">
          <Logo invert={true} full={true} />
        </div>

        <FooterCol colName={"Get Help"}>
          <a href="" className="hover:underline">
            FAQ
          </a>
          <a href="" className="hover:underline">
            Site Feedback
          </a>
          <a href="" className="hover:underline">
            Contact Us
          </a>
        </FooterCol>
        <FooterCol colName={"Company"}>
          <a href="" className="hover:underline">
            About Us
          </a>
          <a href="" className="hover:underline">
            Terms of Use
          </a>
          <a href="" className="hover:underline">
            Privacy Policy
          </a>
          <SocialGroup
            text="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/imagine_collectiive/"
            hiColor="amber-400"
          />
        </FooterCol>

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
            Made with &hearts;
          </a>
          &nbsp;by&nbsp;
          <p className="text-bgTertiary">Joseph Huang</p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
