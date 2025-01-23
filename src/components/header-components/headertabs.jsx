import SectionLinks from "./sectionlinks";

const HeaderTabs = () => {
  const sections = [
    {
      categoryName: "New Arrivals",
      href: "#",
      id: 0,
    },
    {
      categoryName: "Men",
      href: "#",
      id: 1,
    },
    {
      categoryName: "Women",
      href: "#",
      id: 2,
    },
    {
      categoryName: "Children",
      href: "#",
      id: 3,
    },
  ];

  const sectionElements = SectionLinks(sections);

  return (
    <div className="hidden lg:flex flex-row w-fit h-fit gap-2 lg:gap-6 xl:gap-8 2xl:gap-10 text-lg">
      {sectionElements}
    </div>
  );
};
export default HeaderTabs;
