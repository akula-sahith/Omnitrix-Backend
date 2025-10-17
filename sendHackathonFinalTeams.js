import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "./models/Team.js";
import Payment from "./models/Payment.js";
import HackathonFinalTeams from "./models/HackathonFinalTeams.js";

dotenv.config();

const finalTeamIds = [
  "OMX44", "OMX127", "OMX09", "OMX55", "OMX113", "OMX08", "OMX43", "OMX30", "OMX38",
  "OMX04", "OMX54", "OMX27", "OMX50", "OMX95", "OMX21", "OMX26", "OMX49", "OMX57",
  "OMX102", "OMX46", "OMX101", "OMX53", "OMX118", "OMX45", "OMX111", "OMX115",
  "OMX12", "OMX69", "OMX76", "OMX58", "OMX47", "OMX05", "OMX122", "OMX139",
  "OMX35", "OMX90"
];

const seedHackathonFinalTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing entries (optional)
    await HackathonFinalTeams.deleteMany();

    const teams = await Team.find({ teamId: { $in: finalTeamIds } });
    const payments = await Payment.find({ teamId: { $in: finalTeamIds } });

    if (teams.length === 0 && payments.length === 0) {
      console.log("❌ No matching teams or payments found.");
      process.exit();
    }

    const finalTeamsData = [];
    for (let i = 0; i < finalTeamIds.length; i++) {
      const oldId = finalTeamIds[i];
      const team = teams.find(t => t.teamId === oldId);
      const payment = payments.find(p => p.teamId === oldId);

      if (team && payment) {
        const newTeamId = `BEN${String(i + 1).padStart(2, "0")}`;
        finalTeamsData.push({
          newTeamId,
          oldTeamId: team.teamId,
          teamName: team.teamName,
          college: team.college,
          email: team.email,
          phoneNumber: team.phoneNumber,

          // Fetched from Payment collection
          teamLeaderName: payment.teamLeaderName,
          teammate1: payment.teammate1,
          teammate2: payment.teammate2,
          teamSize: payment.teamSize,

          yearOfStudy: team.yearOfStudy,
        });
      }
    }

    await HackathonFinalTeams.insertMany(finalTeamsData);
    console.log(`✅ ${finalTeamsData.length} final hackathon teams inserted successfully!`);

    // Log missing IDs for debugging
    const existingIds = teams.map(t => t.teamId);
    const missingIds = finalTeamIds.filter(id => !existingIds.includes(id));
    if (missingIds.length > 0) {
      console.log("⚠️ Missing teamIds (not found in Team collection):", missingIds);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding hackathon final teams:", error);
    process.exit(1);
  }
};

seedHackathonFinalTeams();
