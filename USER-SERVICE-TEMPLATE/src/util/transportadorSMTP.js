const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE_EMAIL,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  }
});

const sendEmail = async (recipientEmail,message) => {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: recipientEmail,
      text: `Tu codigo de verificacion es: ${message}`,
      html: `<p>:Tu codigo de verificacion es <strong>${message}</strong></p>`
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    return {success:false,message:error.message};
  }
};

module.exports = sendEmail;
