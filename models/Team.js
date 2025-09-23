import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamId: String,
  teamLeaderName: String,
  teamName: String,
  phoneNumber: String,
  email: String,
  college: String,
  teamSize: String,
  yearOfStudy: String,
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
