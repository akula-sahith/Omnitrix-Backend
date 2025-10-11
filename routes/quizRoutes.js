import express from "express";
import Quiz from "../models/Quiz.js";
import Team from "../models/Team.js";
import Question from "../models/Question.js";
import QuizTeam from "../models/QuizTeam.js";  // 👈 add this import
const router = express.Router();

/* ------------------------- 1️⃣ Verify Team ------------------------- */
router.post("/verifyTeam", async (req, res) => {
  const { teamId, email } = req.body;

  try {
    // Check both teamId and email
    const team = await Team.findOne({ teamId, email });

    if (!team) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid Team ID or Email" 
      });
    }

    res.json({ 
      success: true, 
      message: "Team verified successfully" 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error verifying team" 
    });
  }
});


/* ------------------------- 2️⃣ Start Quiz ------------------------- */
router.post("/start", async (req, res) => {
  const { teamId } = req.body;
  try {
    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    let quiz = await Quiz.findOne({ teamId });

    if (quiz && quiz.isSubmitted) {
      return res.status(400).json({ success: false, message: "Quiz already completed" });
    }

    if (!quiz) {
      quiz = await Quiz.create({ teamId });
    }

    const questions = await Question.find().limit(30);
    res.json({ success: true, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error starting quiz" });
  }
});

/* ------------------------- 3️⃣ Submit Quiz ------------------------- */
/* ------------------------- 3️⃣ Submit Quiz ------------------------- */
router.post("/submit", async (req, res) => {
  const { teamId, responses } = req.body;

  try {
    const quiz = await Quiz.findOne({ teamId });
    if (!quiz)
      return res.status(404).json({ success: false, message: "Quiz not found" });
    if (quiz.isSubmitted)
      return res
        .status(400)
        .json({ success: false, message: "Already submitted" });

    let score = 0;

    for (const resp of responses) {
      if (!resp?.questionId || !resp?.selectedOption) continue;
      const q = await Question.findById(resp.questionId);
      if (q && q.correctAnswer === resp.selectedOption) score++;
    }

    // ✅ Use atomic update instead of .save()
    await Quiz.findOneAndUpdate(
      { teamId },
      {
        responses,
        score,
        isSubmitted: true,
        completedAt: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, score });
  } catch (error) {
    console.error("❌ Quiz submission error:", error);
    res.status(500).json({ success: false, message: "Error submitting quiz" });
  }
});

/* ------------------------- 4️⃣ Leaderboard ------------------------- */
router.get("/leaderboard", async (req, res) => {
  try {
    const results = await Quiz.find().sort({ score: -1, completedAt: 1 });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching leaderboard" });
  }
});

/* ------------------------- 5️⃣ Generate QuizTeams Data ------------------------- */
router.post("/generateQuizTeams", async (req, res) => {
  try {
    // 1. Fetch all quizzes that are submitted
    const quizzes = await Quiz.find({ isSubmitted: true }).lean();

    if (!quizzes.length) {
      return res.status(404).json({ success: false, message: "No quizzes found" });
    }

    // 2. Extract teamIds
    const teamIds = quizzes.map(q => q.teamId);

    // 3. Fetch corresponding team details
    const teams = await Team.find({ teamId: { $in: teamIds } }).lean();

    // 4. Combine quiz + team data
    const combinedData = quizzes.map(quiz => {
      const team = teams.find(t => t.teamId === quiz.teamId);
      return {
        teamId: quiz.teamId,
        score: quiz.score,
        completedAt: quiz.completedAt,
        teamName: team?.teamName || "Unknown",
        teamLeaderName: team?.teamLeaderName || "Unknown",
        email: team?.email,
        phoneNumber: team?.phoneNumber,
        college: team?.college,
        teamSize: team?.teamSize,
        yearOfStudy: team?.yearOfStudy,
        teammate1: team?.teammate1,
        teammate2: team?.teammate2,
      };
    });

    // 5. Sort by score (descending), then by completion time (ascending)
    combinedData.sort((a, b) => {
      if (b.score === a.score) {
        return new Date(a.completedAt) - new Date(b.completedAt);
      }
      return b.score - a.score;
    });

    // 6. Clear old records & insert new ones
    await QuizTeam.deleteMany({});
    await QuizTeam.insertMany(combinedData);

    res.json({ success: true, count: combinedData.length, data: combinedData });
  } catch (error) {
    console.error("❌ Error generating quiz teams:", error);
    res.status(500).json({ success: false, message: "Error generating quiz team data" });
  }
});


export default router;
