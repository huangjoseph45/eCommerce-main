const mongoose = require("mongoose");

const mailingListSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: false,
      match: /^[0-9]{10,15}$/,
    },
    emailAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const MailingList = mongoose.model("MailingList", mailingListSchema);
module.exports = { MailingList };
