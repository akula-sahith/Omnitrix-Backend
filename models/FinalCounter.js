import mongoose from "mongoose";

const finalcounterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

export default mongoose.model("FinalCounter", finalcounterSchema);
