import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
});

export default mongoose.model("Coupon", couponSchema);
