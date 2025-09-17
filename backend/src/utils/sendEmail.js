const nodemailer = require("nodemailer");
const path = require("path")
const fs = require("fs")


const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: false,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const templatePath = path.join(process.cwd(),"src","templates",options.template)
  const html = fs.readFileSync(templatePath,"UTF-8")
  const mailOptions = {
    from: `STUDY-BOT <${process.env.SMTP_USER}>`, 
    to: options.to,
    subject: options.subject,
    html: html,
  };
  try {
    await transport.sendMail(mailOptions);
    console.log("email sent successfully");
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = sendEmail