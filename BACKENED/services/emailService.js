const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(name, email, token) {
  try {
    const link = `${process.env.FRONTEND_URL}/verifyemail/${token}`;

    const response = await resend.emails.send({
      from: process.env.RESEND_SENDER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Hello ${name},</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${link}"
           style="background:#4CAF50;color:white;padding:12px 25px;border-radius:6px;text-decoration:none;">
           Verify Email
        </a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("✅ Resend Email Sent:", response);
  } catch (error) {
    console.error("❌ Resend Email Error:", error);
  }
}

module.exports = { sendVerificationEmail };
