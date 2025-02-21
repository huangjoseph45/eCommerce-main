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
      !Array.isArray(sectionInfo.tags)
    ) {
      console.log("could not create section");
      return res
        .status(400)
        .json({ error: "Body must be formatted correctly" });
    }

    const updateData = {
      ...sectionInfo,
    };

    if (sectionInfo.sectionTitle) {
      updateData.slug = slugify(sectionInfo.sectionTitle, {
        lower: true,
        strict: true,
      });
    }

    const createdSection = await Section.findOneAndUpdate(
      { sectionTitle: sectionInfo.sectionTitle },
      {
        $set: {
          tags: sectionInfo.tags || [],
          imageUrl: sectionInfo.imageURL || "",
          isActive: sectionInfo.isActive ?? true,
          description: sectionInfo.description || "",
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
