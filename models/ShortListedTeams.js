import mongoose from "mongoose";

const shortlistedTeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  teamLeaderName: { type: String, required: true },
  teamName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  teamSize: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  teammate1: { type: String },
  teammate2: { type: String },
}, { timestamps: true });

export default mongoose.model("ShortlistedTeam", shortlistedTeamSchema);
