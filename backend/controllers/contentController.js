const { Section } = require("../models/Sections.js");
const slugify = require("slugify");

const createSection = async (req, res) => {
  const { rawData } = req.body;
  try {
    const sectionInfo = rawData ? JSON.parse(rawData) : null;

    if (
      !sectionInfo ||
      !sectionInfo.sectionTitle ||
      !sectionInfo.tags ||
      !Array.isArray(sectionInfo.tags) ||
      (sectionInfo.subsections && sectionInfo.subsections.length === 0)
    ) {
      return res
        .status(400)
        .json({ error: "Body must be formatted correctly" });
    }

    // Validates subsections
    if (sectionInfo.subsections) {
      let validateSubsections = true;
      sectionInfo.subsections.forEach((subsection) => {
        if (!subsection.name || subsection.name.length === 0) {
          validateSubsections = false;
        } else {
          subsection.slug = subsection.name.split(" ").join("-");
        }
      });
      if (!validateSubsections) {
        return res
          .status(400)
          .json({ error: "Subsection must be formatted correctly" });
      }
    }

    const createdSection = await Section.findOneAndUpdate(
      { sectionTitle: sectionInfo.sectionTitle },
      {
        $set: {
          tags: sectionInfo.tags || [],
          imageUrl: sectionInfo.imageURL || "",
          isActive: sectionInfo.isActive ?? true,
          description: sectionInfo.description || "",
          subsections: sectionInfo.subsections || [],
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

const fetchSections = async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true }).lean();

    const returnSections = await Promise.all(
      sections.map(async (section) => {
        if (section.sectionTitle && !section.slug) {
          const slugVal = slugify(section.sectionTitle, {
            lower: true,
            strict: true,
          });

          await Section.updateOne(
            { _id: section._id },
            { $set: { slug: slugVal } }
          );
          return { ...section, slug: slugVal };
        }

        return section;
      })
    );

    return res.status(200).json({ returnSections });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  createSection,
  fetchSections,
};
