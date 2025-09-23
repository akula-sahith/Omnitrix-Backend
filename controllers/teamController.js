import Team from "../models/Team.js";
import Counter from "../models/Counter.js";
import { sendConfirmationEmail } from "../utils/email.js";

// Generate team ID using Counter
async function generateTeamId() {
  let counter = await Counter.findOne({ name: "teamCounter" });
  if (!counter) {
    counter = new Counter({ name: "teamCounter", count: 0 });
  }
  counter.count += 1;
  await counter.save();
  return `OMX${counter.count.toString().padStart(2, "0")}`;
}

export const registerTeam = async (req, res) => {
  try {
    const { teamLeaderName, teamName, phoneNumber, email, college, teamSize, yearOfStudy } = req.body;

    // 🔎 Check if team already registered with this email
    const existingTeam = await Team.findOne({ email });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: `A team is already registered with email: ${email}`,
        teamId: existingTeam.teamId
      });
    }

    // Generate unique teamId
    const teamId = await generateTeamId();

    const newTeam = new Team({
      teamId,
      teamLeaderName,
      teamName,
      phoneNumber,
      email,
      college,
      teamSize,
      yearOfStudy
    });

    await newTeam.save();

    await sendConfirmationEmail(newTeam);

    res.status(200).json({
      success: true,
      teamId,
      message: "Team registered successfully!"
    });
  } catch (err) {
    console.error("❌ Error in registerTeam:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};
