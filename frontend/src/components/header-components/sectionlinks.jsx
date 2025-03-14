import isEmpty from "../utilities/isEmpty";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SectionLinks = (sections, setShow = () => {}) => {
  const [hoverId, setHoverId] = useState(null);
  const nav = useNavigate();
  if (!sections || sections.length < 1) return null;
  return sections.map((element, index) => {
    return (
      <div
        key={isEmpty(element._id) ? index : element._id}
        className="w-fit relative cursor-pointer  hover:text-bgTertiary"
        onMouseEnter={() => setHoverId(element._id)}
        onMouseLeave={() => setHoverId(null)}
        onClick={() => {
          setShow(false);
        }}
      >
        <a
          href={`/${encodeURIComponent(element.slug)}`}
          className="capitalize select-none list-none "
        >
          {element.sectionTitle}
        </a>
      </div>
    );
  });
};

export default SectionLinks;
