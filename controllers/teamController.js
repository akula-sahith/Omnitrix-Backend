import Team from "../models/Team.js";
import Counter from "../models/Counter.js";
import { appendToSheet } from "../utils/sheets.js";
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

    await appendToSheet(newTeam);
    await sendConfirmationEmail(newTeam);

    res.status(200).json({ success: true, teamId, message: "Team registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};
