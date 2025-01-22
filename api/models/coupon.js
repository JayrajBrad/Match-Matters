// const mongoose = require("mongoose");

// const couponSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   value: { type: Number, required: true },
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
//   expiryDate: { type: Date, required: true },
// });

// const coupon = mongoose.model("Coupon", couponSchema);
// module.exports = coupon;

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, required: true }, // Discount value
  code: { type: String, required: true, unique: true }, // Unique coupon code
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Optional for tracking
  expiryDate: { type: Date, required: true },
  isRedeemed: { type: Boolean, default: false }, // Redeemed status
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
