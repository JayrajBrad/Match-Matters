// // models/Ticket.js
// const mongoose = require("mongoose");

// const TicketSchema = new mongoose.Schema({
//   user_id: String,
//   event_id: String,
//   purchase_time: Date,
//   ticket_code: String, // or any unique code/QR for the event
//   // add any other fields needed, e.g. seat info, etc.
// });

// module.exports = mongoose.model("Ticket", TicketSchema);

// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  ticket_code: String,
  purchase_time: Date,
});

module.exports = mongoose.model("Ticket", ticketSchema);
