import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // e.g. [A, B, C, D]
  correctAnswer: { type: String, required: true } // must match one option
});

export default mongoose.model("Question", questionSchema);
