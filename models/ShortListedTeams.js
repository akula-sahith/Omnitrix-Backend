import mongoose from "mongoose";

const shortlistedTeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
});

export default mongoose.model("ShortlistedTeam", shortlistedTeamSchema);
