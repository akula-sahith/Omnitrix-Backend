import mongoose from "mongoose";

const roundTwoSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const RoundTwoSubmission = mongoose.model("RoundTwoSubmission", roundTwoSchema);
export default RoundTwoSubmission;
