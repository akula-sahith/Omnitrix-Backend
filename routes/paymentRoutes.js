import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import ShortlistedTeam from "../models/ShortListedTeams.js";
import Payment from "../models/Payment.js";
import FinalTeam from "../models/FinalTeams.js";
import FinalCounter from "../models/FinalCounter.js";
import Team from "../models/Team.js";
import IdeaSubmission from "../models/IdeaSubmission.js";
import Coupon from "../models/Coupon.js"; // 👈 import coupon model

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Cloudinary config
cloudinary.v2.config({
  cloud_name: "dsrsl0dul",
  api_key: "117194973157861",
  api_secret: "ovdfhEjwbvwwOVWxRfKWyqG8TZs",
});

/* ==========================================================
   ✅ 1️⃣ Verify if teamId is shortlisted
   ========================================================== */
router.post("/verify-shortlist", async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId)
      return res.status(400).json({ success: false, message: "Team ID is required" });

    const shortlisted = await ShortlistedTeam.findOne({ teamId });
    if (!shortlisted)
      return res.status(404).json({ success: false, message: "Team not shortlisted" });

    res.json({
      success: true,
      message: "Team is shortlisted",
      teamDetails: shortlisted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error checking shortlist" });
  }
});

/* ==========================================================
   ✅ 2️⃣ Verify Coupon for Team
   ========================================================== */
router.post("/verify-coupon", async (req, res) => {
  try {
    const { teamId, code } = req.body;

    if (!teamId || !code) {
      return res.status(400).json({
        success: false,
        message: "Team ID and Coupon Code are required",
      });
    }

    // Check for matching coupon
    const coupon = await Coupon.findOne({ teamId, code });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid Team ID or Coupon Code",
      });
    }

    // Check if already used
    if (coupon.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Coupon has already been used ❌",
      });
    }

    // Mark as used
    coupon.isUsed = true;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon verified successfully ✅",
      couponDetails: coupon,
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    res.status(500).json({
      success: false,
      message: "Server error verifying coupon",
    });
  }
});

/* ==========================================================
   ✅ 3️⃣ Payment Submission
   ========================================================== */
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

    // 2️⃣ Get college and year
    const teamData = await Team.findOne({ teamId });
    const college = teamData ? teamData.college : "";
    const yearOfStudy = teamData ? teamData.yearOfStudy : "";

    // 3️⃣ Upload screenshot
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

    const paymentScreenshot = uploadResult.secure_url;

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
    if (!counter) counter = new FinalCounter({ count: 0 });
    counter.count += 1;
    await counter.save();
    const newTeamId = `BEN${counter.count.toString().padStart(2, "0")}`;

    // 6️⃣ Save final team
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

router.post("/submit-idea", upload.single("pptFile"), async (req, res) => {
  try {
    const { teamId, teamName, problemStatement, ideaDescription } = req.body;
    console.log("Got request");
    // 1️⃣ Verify team exists
    const team = await FinalTeam.findOne({ newTeamId: teamId });
    if (!team) return res.status(400).json({ success: false, message: "Team not found" });

    // 2️⃣ Prevent duplicate submission
    const existing = await IdeaSubmission.findOne({ teamId });
    if (existing) return res.status(400).json({ success: false, message: "Idea already submitted" });

    // 3️⃣ Check file
    if (!req.file) return res.status(400).json({ success: false, message: "No PPT uploaded" });

    // 4️⃣ Upload PPT to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "hackathon_ppts",
          resource_type: "raw", // important for documents like ppt/pptx/pdf
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const pptUrl = uploadResult.secure_url;

    // 5️⃣ Save submission in DB
    const submission = new IdeaSubmission({
      teamId,
      teamName,
      problemStatement,
      ideaDescription,
      dropboxFilePath: pptUrl // you can rename field to cloudinaryUrl if needed
    });

    await submission.save();

    res.json({ success: true, message: "Idea & PPT uploaded successfully!", pptUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
});

export default router;
