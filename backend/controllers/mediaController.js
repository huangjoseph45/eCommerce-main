const { MailingList } = require("../models/mailingList.js");

const sendEmail = (req, res) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imaginecollective0@gmail.com",
      pass: "OxT9L7xSK36p",
    },
  });

  const mailOptions = {
    from: "imaginecollective0@gmail.com",
    to: "dragonjo3000@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const addToMailingList = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Requires an email or password" });
  }

  const user = req?.session?.user;
  try {
    const mailingListItem = await MailingList.findOneAndUpdate(
      { emailAddress: email },
      {
        $set: {
          emailAddress: email,
          phoneNumber: phoneNumber,
          userId: user?._id,
        },
      },
      { new: true, runValidators: true, upsert: true }
    );
    console.log(email);
    return res.status(200).json({ mailingListItem });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "There was an error adding you to our mailing list" });
  }
};

module.exports = { sendEmail, addToMailingList };
