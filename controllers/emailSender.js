const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.SENDER,
    to: email,
    subject: subject,
    html:
      "<h4>Please click the link to verify your email: <br></h4>" +
      `${message}`,
  };
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnAuthorized: true,
    },
  });

  return await transporter
    .sendMail(mailOptions)
    .then((res) => {
      console.log(`Message Sent: ${res.messageId}`);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

module.exports = sendEmail;
