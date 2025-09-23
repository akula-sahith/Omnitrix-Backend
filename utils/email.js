import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export async function sendConfirmationEmail(team) {
  const body = `
Hi ${team.teamLeaderName},

Thank you for registering for OMNITRIX Hackathon! 🎉

Your Team ID: ${team.teamId}
Team Name: ${team.teamName}
Team Leader: ${team.teamLeaderName}

Good luck! 🚀
`;

  try {
    await transporter.sendMail({
      from: `"OMNITRIX Hackathon" <${process.env.EMAIL_USER}>`,
      to: team.email,
      subject: "OMNITRIX Hackathon Registration Confirmation",
      text: body,
    });
    console.log("✅ Confirmation email sent to", team.email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}
