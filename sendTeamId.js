import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "./models/Team.js";
import ShortlistedTeam from "./models/ShortListedTeams.js";

dotenv.config();

// Example list of teamIds you want to shortlist
const teamIdsToShortlist = ["OMX04", "OMX08", "OMX09", "OMX05", "OMX12", "OMX21", "OMX26", "OMX27", "OMX30", "OMX31", "OMX38", "OMX43", "OMX44", "OMX45", "OMX46", "OMX47", "OMX49", "OMX50", "OMX54", "OMX55", "OMX57", "OMX58", "OMX71", "OMX76", "OMX82", "OMX95", "OMX101", "OMX102", "OMX108", "OMX111", "OMX112", "OMX113", "OMX115", "OMX118", "OMX127"]; // replace with your actual list

const seedShortlistedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing shortlisted teams (optional)
    await ShortlistedTeam.deleteMany();

    // Fetch team details for all given teamIds
    const teams = await Team.find({ teamId: { $in: teamIdsToShortlist } });

    if (teams.length === 0) {
      console.log("❌ No matching teams found in Team collection");
      process.exit();
    }

    // Insert into ShortlistedTeam
    await ShortlistedTeam.insertMany(teams);

    console.log(`✅ ${teams.length} teams shortlisted successfully!`);
    const existingTeams = await Team.find({ teamId: { $in: teamIdsToShortlist } });
const existingIds = existingTeams.map(t => t.teamId);

const missingIds = teamIdsToShortlist.filter(id => !existingIds.includes(id));
console.log("Missing teamIds:", missingIds);

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding shortlisted teams:", error);
    process.exit(1);
  }
};

seedShortlistedTeams();
