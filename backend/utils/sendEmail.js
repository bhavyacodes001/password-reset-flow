/**
 * utils/sendEmail.js - Email Sending Utility
 * 
 * Uses Resend HTTP API to send password reset emails.
 * Resend is used instead of direct SMTP because Render's
 * free tier blocks outbound SMTP ports (465, 587).
 */

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email to the specified address.
 * @param {string} toEmail - Recipient's email address
 * @param {string} resetToken - The unique token for password reset
 */
const sendResetEmail = async (toEmail, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await resend.emails.send({
    from: "Password Reset <onboarding@resend.dev>",
    to: toEmail,
    subject: "Password Reset Request",
    html: `
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
    `,
  });
};

module.exports = sendResetEmail;
