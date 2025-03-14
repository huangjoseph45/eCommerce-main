import SectionLinks from "./sectionlinks";

const HeaderTabs = ({ sections }) => {
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
  const sectionElements = sections ? SectionLinks(sections) : null;

  return (
    <div className="hidden lg:flex flex-row w-fit h-fit gap-2 lg:gap-6 xl:gap-8 2xl:gap-10 text-lg">
      {sectionElements}
    </div>
  );
};
export default HeaderTabs;
