import mongoose from "mongoose";

const ideaSubmissionSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true }, // prevent duplicate submissions
  teamName: { type: String, required: true },
  problemStatement: { type: String, required: true },
  ideaDescription: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const IdeaSubmission = mongoose.models.IdeaSubmission || mongoose.model("IdeaSubmission", ideaSubmissionSchema);

export default IdeaSubmission;
