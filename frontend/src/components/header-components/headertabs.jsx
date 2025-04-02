import SectionLinks from "./sectionlinks";

const HeaderTabs = ({ sections, headerRef, underlineBlack }) => {
  // const sections = [
  //   {
  //     categoryName: "New Arrivals",
  //     href: "new",
  //     id: 0,
  //   },
  //   {
  //     categoryName: "Men",
  //     href: "men",
  //     id: 1,
  //   },
  //   {
  //     categoryName: "Women",
  //     href: "women",
  //     id: 2,
  //   },
  //   {
  //     categoryName: "Children",
  //     href: "children",
  //     id: 3,
  //   },
  // ];
  const sectionElements = sections
    ? SectionLinks({ sections, underlineBlack })
    : null;

  return (
    <ul className="hidden lg:flex flex-row w-fit h-fit  text-lg">
      {sectionElements}
    </ul>
  );
};
export default HeaderTabs;
