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

module.exports = { sendEmail };
