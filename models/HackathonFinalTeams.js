import mongoose from "mongoose";

const hackathonFinalTeamSchema = new mongoose.Schema({
  newTeamId: { type: String, required: true }, // e.g., BEN01
  oldTeamId: { type: String, required: true }, // e.g., OMX04
  teamLeaderName: String,
  teamName: String,
  phoneNumber: String,
  email: String,
  college: String,
  teamSize: String,
  yearOfStudy: String,
  teammate1: String,
  teammate2: String,
}, { timestamps: true });

export default mongoose.model("HackathonFinalTeams", hackathonFinalTeamSchema);
