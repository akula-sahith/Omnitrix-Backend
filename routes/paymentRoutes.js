import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import ShortlistedTeam from "../models/ShortListedTeams.js";
import Payment from "../models/Payment.js";
import FinalTeam from "../models/FinalTeams.js";
import FinalCounter from "../models/FinalCounter.js";
import Team from "../models/Team.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store in memory for upload

// 🔹 Cloudinary config
cloudinary.v2.config({
  cloud_name: "dsrsl0dul",   // replace with your Cloudinary cloud name
  api_key: "746473455699629",         // replace with your API key
  api_secret: "oGRlhfT0dfbLe-Lss58bzgSrO0s",   // replace with your API secret
});

router.post("/submit-payment", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      teamId,
      teamName,
      teamLeaderName,
      teamSize,
      teammate1,
      teammate2,
      UTR_ID,
    } = req.body;

    // 1️⃣ Check if teamId is shortlisted
    const shortlisted = await ShortlistedTeam.findOne({ teamId });
    if (!shortlisted) return res.status(400).json({ error: "Team not shortlisted" });

    // 2️⃣ Get college from Teams collection
    const teamData = await Team.findOne({ teamId });
    const college = teamData ? teamData.college : "";
    const yearOfStudy = teamData ? teamData.yearOfStudy : "";

    // 3️⃣ Upload screenshot to Cloudinary
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "payment_screenshots" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const paymentScreenshot = uploadResult.secure_url; // URL to store in DB

    // 4️⃣ Save payment info
    const payment = new Payment({
      teamId,
      teamName,
      teamLeaderName,
      teamSize,
      teammate1,
      teammate2: teammate2 || null,
      paymentScreenshot,
      UTR_ID,
      college,
    });
    await payment.save();

    // 5️⃣ Generate newTeamId
    let counter = await FinalCounter.findOne();
    if (!counter) {
      counter = new FinalCounter({ count: 0 });
      await counter.save();
    }
    counter.count += 1;
    await counter.save();
    const newTeamId = `BEN${counter.count.toString().padStart(2, "0")}`;

    // 6️⃣ Save to FinalTeams (without payment info)
    const finalTeam = new FinalTeam({
      newTeamId,
      teamName,
      teamLeaderName,
      teamSize,
      teammate1,
      teammate2: teammate2 || null,
      college,
      yearOfStudy,
    });
    await finalTeam.save();

    res.json({ success: true, newTeamId, paymentScreenshot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
