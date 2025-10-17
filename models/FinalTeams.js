import mongoose from "mongoose";

const finalTeamSchema = new mongoose.Schema({
  newTeamId: { type: String, required: true, unique: true }, // BEN01, BEN02
  teamName: { type: String, required: true },
  teamLeaderName: { type: String, required: true },
  teamSize: { type: Number, required: true },
  teammate1: { type: String, required: true },
  teammate2: { type: String },
  college: { type: String },
  yearOfStudy: { type: String },
}, { timestamps: true });

// ✅ Check if model already exists, otherwise create it
const FinalTeam = mongoose.models.FinalTeam || mongoose.model("FinalTeam", finalTeamSchema);

export default FinalTeam;
