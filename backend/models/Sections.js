const mongoose = require("mongoose");
const slugify = require("slugify");

const SectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true, // Fixed typo
      unique: true,
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
      set: (tags) => tags.map((tag) => tag.toLowerCase()),
    },
    imageURLExtension: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageURL: {
      type: String,
      trim: true,
    },
    subsections: {
      type: [
        {
          name: {
            type: String,
            required: true,
            lowercase: true,
          },
          slug: {
            type: String,
            lowercase: true,
            unique: false,
            set: (name) => name.split(" ").join("-"),
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Automatically generate slug when `sectionTitle` is modified
SectionSchema.pre("validate", function (next) {
  if (this.isModified("sectionTitle")) {
    this.slug = slugify(this.sectionTitle, { lower: true, strict: true });
  }
  next();
});

const Section = mongoose.model("Section", SectionSchema);

module.exports = { Section };
