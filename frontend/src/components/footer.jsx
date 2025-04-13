import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import SocialGroup from "./footer-components/social-group";
import Logo from "./header-components/logo";
import MailingListInput from "./mailingListInput";
import FooterCol from "./footer-components/footerCol";

const footerCols = [
  {
    colName: "Get Help",
    colItems: [
      { footerName: "FAQ", slug: "faq" },
      { footerName: "Site Feedback", slug: "feedback" },
      { footerName: "Contact Us", slug: "contact" },
    ],
  },

  {
    colName: "Company",
    colItems: [
      { footerName: "About Us", slug: "about" },
      { footerName: "Terms of Use", slug: "terms" },
      { footerName: "Privacy Policy", slug: "privacy" },
      {
        component: (
          <SocialGroup
            text="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/imagine_collectiive/"
            hiColor="amber-400"
          />
        ),
      },
    ],
  },
];

const Footer = () => {
  return (
    <div className=" text-textLight  bg-bgDarkLight w-full">
      <div className="relative mx-auto w-full h-fit  pt-[2rem] md:pt-[3rem] pb-[2rem] sm:pb-0 mt-[2rem] md:mt-[4rem] flex flex-col sm:flex-row justify-around items-start">
        <div className="hidden md:block left-8 md:w-36 lg:w-48 top-[4rem]">
          <Logo invert={true} full={true} />
        </div>
        {footerCols.map((col) => {
          console.log(col);
          return (
            <FooterCol key={col.colName} colName={col.colName}>
              {col.colItems.map((item) => {
                if (item.component) {
                  return item.component;
                }
                return (
                  <a
                    key={item.slug}
                    href={"/" + item.slug}
                    className="hover:underline"
                  >
                    {item.footerName}
                  </a>
                );
              })}
            </FooterCol>
          );
        })}

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
