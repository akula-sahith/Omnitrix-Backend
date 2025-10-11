import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  teamId: { type: String, required: true },
  isUsed: { type: Boolean, default: false }, // 👈 track usage
}, { timestamps: true }); // optional: adds createdAt, updatedAt

// Ensure each (code, teamId) pair is unique
couponSchema.index({ code: 1, teamId: 1 }, { unique: true });

export default mongoose.model("Coupon", couponSchema);
