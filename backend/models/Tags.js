const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

TagsSchema.index(
  { tagName: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Tag = mongoose.model("Tag", TagsSchema);

module.exports = Tag;
