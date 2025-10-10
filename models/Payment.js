import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  teamName: { type: String, required: true },
  teamLeaderName: { type: String, required: true },
  teamSize: { type: Number, required: true },
  teammate1: { type: String, required: true },
  teammate2: { type: String },
  paymentScreenshot: { type: String, required: true }, // Cloudinary URL
  UTR_ID: { type: String, required: true },
  college: { type: String },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
