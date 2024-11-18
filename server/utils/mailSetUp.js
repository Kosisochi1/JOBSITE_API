const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASSWORD,
  },
});

const mailsender = async (to, html, subject) => {
  return await transporter.sendMail({
    from: process.env.MAILUSER,
    to,
    html,
    subject,
  });
};

const sendmail = async ({ name, to, subject, html, origin }) => {
  return mailsender(to, html, subject);
};

module.exports = {
  sendmail,
};
