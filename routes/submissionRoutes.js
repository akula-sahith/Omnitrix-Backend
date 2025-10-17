import express from "express";
import FinalTeam from "../models/FinalTeams.js";
import IdeaSubmission from "../models/IdeaSubmission.js";

const router = express.Router();

router.post("/submit-idea", async (req, res) => {
  try {
    const { teamId, teamName, problemStatement, ideaDescription } = req.body;

    // 1️⃣ Verify team exists
    const team = await FinalTeam.findOne({ newTeamId: teamId });
    if (!team) return res.status(400).json({ success: false, message: "Team not found" });

    // 2️⃣ Prevent duplicate submission
    const existing = await IdeaSubmission.findOne({ teamId });
    if (existing) return res.status(400).json({ success: false, message: "Idea already submitted" });

    // 3️⃣ Save submission in DB
    const submission = new IdeaSubmission({
      teamId,
      teamName,
      problemStatement,
      ideaDescription,
    });
    await submission.save();

    res.json({ success: true, message: "Idea submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
});

export default router;
