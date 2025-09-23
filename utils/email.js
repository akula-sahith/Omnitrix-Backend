// utils/email.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// List of SendGrid accounts (API keys + from emails)
const sendGridAccounts = [
  { apiKey: process.env.SENDGRID_API_KEY_1, from: process.env.EMAIL_FROM_1 },
  { apiKey: process.env.SENDGRID_API_KEY_2, from: process.env.EMAIL_FROM_2 },
  // add more accounts if needed
];

export async function sendConfirmationEmail(team) {
  const bodyText = `
Hi ${team.teamLeaderName},

Thank you for registering for OMNITRIX Hackathon! 🎉

Your Team ID: ${team.teamId}
Team Name: ${team.teamName}
Team Leader: ${team.teamLeaderName}

Good luck! 🚀
`;

  for (let account of sendGridAccounts) {
    try {
      sgMail.setApiKey(account.apiKey);
      await sgMail.send({
        to: team.email,
        from: account.from,
        subject: "OMNITRIX Hackathon Registration Confirmation",
        text: bodyText,
      });
      console.log("✅ Confirmation email sent to", team.email, "via", account.from);
      return; // success, exit the function
    } catch (err) {
      console.error(
        `❌ Error sending email via ${account.from}, trying next account...`,
        err.message
      );
    }
  }

  console.error("❌ All email accounts failed for", team.email);
}
