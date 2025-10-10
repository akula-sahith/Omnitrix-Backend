import mongoose from "mongoose";
import dotenv from "dotenv";
import ShortlistedTeam from "./models/ShortListedTeams";

dotenv.config();

// Generate 10 sample shortlisted team IDs
const teamCount = 10;
const teams = Array.from({ length: teamCount }, (_, i) => ({
  teamId: `OMX${(i + 1).toString().padStart(2, "0")}`,
}));

const seedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await ShortlistedTeam.deleteMany();

    // Insert new team IDs
    await ShortlistedTeam.insertMany(teams);

    console.log(`✅ ${teamCount} shortlisted teams seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding teams:", error);
    process.exit(1);
  }
};

seedTeams();
