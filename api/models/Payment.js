// // models/Payment.js
// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema({
//   link_id: String,
//   user_id: String,
//   event_id: String,
//   user_email: String,
//   user_name: String,
//   phone: String,
//   amount: Number,
//   status: String,
//   payment_time: Date,
// });

// module.exports = mongoose.model("Payment", PaymentSchema);

// Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  link_id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  user_email: String,
  user_name: String,
  phone: String,
  amount: Number,
  status: String,
  payment_time: Date,
  // etc...
});

module.exports = mongoose.model("Payment", paymentSchema);
