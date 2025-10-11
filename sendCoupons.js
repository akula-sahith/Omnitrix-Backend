import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "./models/Coupon.js"; // adjust path if needed

dotenv.config();

// Number of coupons to insert
const couponCount = 10;

// Generate random coupon codes for sample teams
const coupons = Array.from({ length: couponCount }, (_, i) => ({
  teamId: `OMX${(i + 1).toString().padStart(2, "0")}`,
  code: `COUPON${(Math.random() + 1).toString(36).substring(2, 8).toUpperCase()}`,
  used: false, // initially unused
}));

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing coupons
    await Coupon.deleteMany();

    // Insert new coupons
    await Coupon.insertMany(coupons);

    console.log(`✅ ${couponCount} coupons seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    process.exit(1);
  }
};

seedCoupons();
