import mongoose from "mongoose";

const quizTeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  teamName: String,
  teamLeaderName: String,
  email: String,
  phoneNumber: String,
  college: String,
  teamSize: String,
  yearOfStudy: String,
  teammate1: String,
  teammate2: String,
  score: Number,
  completedAt: Date,
}, { timestamps: true });

export default mongoose.model("QuizTeam", quizTeamSchema);
