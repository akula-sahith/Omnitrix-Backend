import express from "express";
import FinalTeam from "../models/FinalTeams.js";
import IdeaSubmission from "../models/IdeaSubmission.js";
import MVPSubmission from "../models/MVPSubmission.js";
import RoundTwoSubmission from "../models/RoundTwoSubmission.js";
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

router.post("/round-two", async (req, res) => {
  try {
    const { teamId, teamName, problemStatement, techStack } = req.body;

    if (!teamId || !teamName || !problemStatement || !techStack) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingTeam = await RoundTwoSubmission.findOne({ teamId });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team with this ID already submitted.",
      });
    }

    const newSubmission = new RoundTwoSubmission({
      teamId,
      teamName,
      problemStatement,
      techStack,
    });

    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: "Tech stack submitted successfully!",
      data: newSubmission,
    });
  } catch (err) {
    console.error("Error submitting Round Two data:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting data.",
    });
  }
});

// 🔹 GET /api/round-two → Get all submissions sorted by teamId (BEN01 → BEN99)
router.get("/", async (req, res) => {
  try {
    const submissions = await RoundTwoSubmission.find().sort({
      teamId: 1, // ascending
    });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching submissions.",
    });
  }
});

router.post("/mvp-features", async (req, res) => {
  try {
    const { teamId, teamName, domain, problemStatement, mvpFeatures } = req.body;

    // ✅ Validate fields
    if (!teamId || !teamName || !domain || !problemStatement || !mvpFeatures) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ✅ Check if team already submitted
    const existing = await MVPSubmission.findOne({ teamId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Team with this ID has already submitted MVP features.",
      });
    }

    // ✅ Create new submission
    const submission = new MVPSubmission({
      teamId,
      teamName,
      domain,
      problemStatement,
      mvpFeatures,
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "MVP features submitted successfully!",
      data: submission,
    });
  } catch (err) {
    console.error("Error submitting MVP features:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting MVP features.",
    });
  }
});


export default router;
