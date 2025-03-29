import isEmpty from "../utilities/isEmpty";
import SectionLink from "./sectionLink";

const SectionLinks = (sections, setShow = () => {}) => {
  if (!sections || sections.length < 1) return null;
  return sections.map((element, index) => {
    return (
      <SectionLink
        key={isEmpty(element._id) ? index : element._id}
        element={element}
        setShow={setShow}
      />
    );
  });
};

export default SectionLinks;
