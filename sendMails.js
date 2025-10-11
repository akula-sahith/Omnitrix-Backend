import mongoose from "mongoose";
import dotenv from "dotenv";
import ShortlistedTeam from "./models/ShortListedTeams.js";
import nodemailer from "nodemailer";

dotenv.config();

const sendEmail = async (team) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
  from: process.env.EMAIL_USER,
  to: team.email, // team email from DB
  subject: "🎯 You've Been Shortlisted for Omnitrix 2025 Hackathon!",
  text: `
Hello ${team.teamName}, 👋

🚀 Congratulations! You have been **shortlisted** for the Omnitrix 2025 Hackathon!  

Your skills and enthusiasm have earned you a spot among the top contenders. 🌟

🗓 **Hackathon Dates:** October 17th and 18th, 2025  
📍 Be ready to take on the challenge and showcase your tech brilliance!  

Join our WhatsApp group for all updates, tips, and communication:  
https://chat.whatsapp.com/LgFx7upKJ6b9teMiHFyoEy?mode=ems_wa_t

⚡ Unlock your inner Azmuth and get ready to innovate!  

Best regards,  
--- Team Omnitrix 2025
  `,
};


  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${team.teamName} (${team.email})`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${team.teamName} (${team.email}):`, err);
  }
};

const sendEmailsToShortlistedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Fetch all shortlisted teams
    const teams = await ShortlistedTeam.find({});
    if (teams.length === 0) {
      console.log("❌ No shortlisted teams found");
      process.exit();
    }

    // Send emails sequentially
    for (const team of teams) {
      await sendEmail(team);
    }

    console.log(`✅ Emails sent to all ${teams.length} shortlisted teams!`);
    process.exit();
  } catch (err) {
    console.error("❌ Error sending emails:", err);
    process.exit(1);
  }
};

sendEmailsToShortlistedTeams();
