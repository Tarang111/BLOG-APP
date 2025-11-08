const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(name, email, token) {
  const link = `${process.env.FRONTEND_URL}/verifyemail/${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM, // ✅ your gmail
    subject: "Verify your email",
    html: `
      <h2>Hello ${name},</h2>
      <p>Click below to verify your email:</p>
      <a href="${link}"
         style="background:#4CAF50;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
         Verify Email
      </a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body || error);
  }
}

module.exports = { sendVerificationEmail };
