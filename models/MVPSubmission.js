import mongoose from "mongoose";

const MVPSubmissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ["AI Agents & Automation", "Web 3.0 & Blockchain", "Full Stack Development", "Open Innovation"],
    },
    problemStatement: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1500,
      trim: true,
    },
    mvpFeatures: {
      type: String,
      required: true,
      minlength: 50,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MVPSubmission", MVPSubmissionSchema);
