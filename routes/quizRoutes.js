import express from "express";
import Quiz from "../models/Quiz.js";
import Team from "../models/Team.js";
import Question from "../models/Question.js";

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
      // Ensure questionId and selectedOption exist
      if (!resp?.questionId || !resp?.selectedOption) continue;

      const q = await Question.findById(resp.questionId);
      if (q && q.correctAnswer === resp.selectedOption) {
        score++;
      }
    }

    quiz.responses = responses;
    quiz.score = score;
    quiz.isSubmitted = true;
    quiz.completedAt = new Date();

    await quiz.save();

    res.json({ success: true, score });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error submitting quiz", error });
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

export default router;
