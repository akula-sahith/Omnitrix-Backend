// utils/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// List of Gmail accounts (email + app password)
const gmailAccounts = [
  { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASS },
  // { user: process.env.EMAIL_USER_2, pass: process.env.EMAIL_PASS_2 }, // optional backup
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

  for (let account of gmailAccounts) {
    try {
      // create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: account.user,
          pass: account.pass, // App Password
        },
      });

      await transporter.sendMail({
        from: account.user,
        to: team.email,
        subject: "OMNITRIX Hackathon Registration Confirmation",
        text: bodyText,
      });

      console.log(`✅ Confirmation email sent to ${team.email} via ${account.user}`);
      return; // success → stop trying
    } catch (err) {
      console.error(
        `❌ Error sending email via ${account.user}, trying next account...`,
        err.message
      );
    }
  }

  console.error("❌ All email accounts failed for", team.email);
}
