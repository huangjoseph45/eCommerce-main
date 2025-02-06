import isEmpty from "../utilities/isEmpty";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SectionLinks = (sections) => {
  const [hoverId, setHoverId] = useState(null);
  const nav = useNavigate();
  return sections.map((element, index) => {
    return (
      <div
        key={isEmpty(element.id) ? index : element.id}
        className="w-fit relative"
        onMouseEnter={() => setHoverId(element.id)}
        onMouseLeave={() => setHoverId(null)}
        onClick={() => nav(`/search?q=${encodeURIComponent(element.href)}`)}
      >
        <li
          href={element.href}
          className="font-semibold cursor-pointer select-none list-none hover:text-gray-500"
        >
          {element.categoryName}
        </li>

        {window.innerWidth > 1024 && (
          <AnimatePresence>
            {hoverId === element.id && (
              <motion.div
                className="absolute border border-black left-0 top-full z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                exit={{ width: 0 }}
                transition={{
                  duration: 0.15,
                }}
              ></motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  });
};

export default SectionLinks;
