const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP host
  port: 465,
  secure: true,
  auth: {
    user: process.env.BREVO_SMTP_USER, // SMTP login
    pass: process.env.BREVO_SMTP_PASS, // SMTP password
  },
});

// ✅ verify SMTP connection (runs once at server start)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

module.exports = transporter;
