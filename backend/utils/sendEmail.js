const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const buildHtml = (resetLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
    <p style="color: #555; font-size: 16px;">
      You requested a password reset. Click the button below to set a new password.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}"
         style="background-color: #6c5ce7; color: white; padding: 12px 30px;
                text-decoration: none; border-radius: 5px; font-size: 16px;">
        Reset Password
      </a>
    </div>
    <p style="color: #888; font-size: 14px;">
      This link will expire in <strong>15 minutes</strong>.
    </p>
    <p style="color: #888; font-size: 14px;">
      If you didn't request this, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="color: #aaa; font-size: 12px; text-align: center;">
      Password Reset Flow App
    </p>
  </div>
`;

async function sendViaBrevo(toEmail, resetLink) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Password Reset", email: process.env.EMAIL_USER },
      to: [{ email: toEmail }],
      subject: "Password Reset Request",
      htmlContent: buildHtml(resetLink),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Brevo failed");
  }
}

async function sendViaResend(toEmail, resetLink) {
  await resend.emails.send({
    from: `Password Reset <onboarding@resend.dev>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: buildHtml(resetLink),
  });
}

const sendResetEmail = async (toEmail, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  if (process.env.BREVO_API_KEY && process.env.BREVO_API_KEY !== "your_brevo_api_key_here") {
    try {
      await sendViaBrevo(toEmail, resetLink);
      console.log("Email sent via Brevo");
      return;
    } catch (err) {
      console.log("Brevo failed, falling back to Resend:", err.message);
    }
  }

  await sendViaResend(toEmail, resetLink);
  console.log("Email sent via Resend");
};

module.exports = sendResetEmail;
