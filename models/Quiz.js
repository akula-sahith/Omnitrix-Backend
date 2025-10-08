import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOption: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  responses: [responseSchema],
  score: { type: Number, default: 0 },
  isSubmitted: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
