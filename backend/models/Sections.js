const mongoose = require("mongoose");
const slugify = require("slugify");

const SectionSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      unique: true,
      require: true,
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
      set: (tags) => tags.map((tag) => tag.toLowerCase()),
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageURL: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

SectionSchema.pre("save", function (next) {
  if (this.isModified("sectionTitle")) {
    this.slug = slugify(this.sectionTitle, { lower: true, strict: true });
  }
  next();
});

const Section = mongoose.model("Section", SectionSchema);

module.exports = { Section };
