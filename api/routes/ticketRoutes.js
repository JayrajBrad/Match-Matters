// // routes/ticketRoutes.js (for example)
// const express = require("express");
// const router = express.Router();
// const Payment = require("../models/Payment");
// const Ticket = require("../models/Ticket"); // from your newly created model

// router.post("/create-ticket", async (req, res) => {
//   try {
//     const { userId, eventId, linkId } = req.body;

//     // 1) Verify the payment is in the DB with status = "PAID"
//     const payment = await Payment.findOne({
//       link_id: linkId,
//       user_id: userId,
//       event_id: eventId,
//     });
//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }
//     if (payment.status !== "PAID") {
//       return res
//         .status(400)
//         .json({ error: "Payment not completed or not found" });
//     }

//     // 2) Create the ticket
//     // You can generate a random code or do anything that suits your requirement
//     const ticketCode = `TICKET-${Math.random()
//       .toString(36)
//       .substr(2, 6)
//       .toUpperCase()}`;

//     const newTicket = new Ticket({
//       user_id: userId,
//       event_id: eventId,
//       purchase_time: new Date(), // or payment.payment_time
//       ticket_code: ticketCode,
//     });

//     await newTicket.save();

//     return res.json({
//       message: "Ticket created successfully",
//       ticket: newTicket,
//     });
//   } catch (err) {
//     console.error("Error creating ticket:", err);
//     res.status(500).json({ error: "Server error creating ticket" });
//   }
// });

// router.get("/tickets", async (req, res) => {
//   try {
//     const { userId } = req.query;
//     console.log(userId);
//     if (!userId) {
//       return res.status(400).json({ error: "Missing userId" });
//     }

//     // Find all tickets for this user
//     const tickets = await Ticket.find({ user_id: userId });
//     // .populate('eventId', 'title')

//     // If you do .populate, you can read eventTitle from the populated doc
//     // or store it directly on your ticket docs if you prefer.

//     // Then respond with an array
//     res.json({ tickets });
//   } catch (err) {
//     console.error("Error fetching tickets:", err);
//     res.status(500).json({ error: "Server error fetching tickets" });
//   }
// });

// module.exports = router;

// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket"); // from your newly created model
const User = require("../models/user");
const Event = require("../models/event");

// CREATE TICKET
router.post("/create-ticket", async (req, res) => {
  try {
    const { userId, eventId, linkId, couponId } = req.body;

    // 1) Verify the payment with status = "PAID"
    const payment = await Payment.findOne({
      link_id: linkId,
      userId: userId, // <-- Notice these match the Payment schema fields if it also uses userId/eventId
      eventId: eventId,
    });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    if (payment.status !== "PAID") {
      return res
        .status(400)
        .json({ error: "Payment not completed or not found" });
    }

    const existingTicket = await Ticket.findOne({ userId, eventId });
    if (existingTicket) {
      // You can return an error or simply return the existing ticket
      return res.status(400).json({
        error: "Ticket already generated for this user & event.",
        ticket: existingTicket,
      });
    }

    // 2) Create the ticket
    const ticketCode = `TICKET-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const newTicket = new Ticket({
      userId, // <-- Matches the schema (not user_id)
      eventId,
      purchase_time: new Date(), // or payment.payment_time
      ticket_code: ticketCode,
    });

    await newTicket.save();

    if (couponId) {
      // Adjust to match your coupon model and schema
      await Coupon.findByIdAndDelete(couponId);
      console.log(`Coupon ${couponId} has been removed from the database.`);
    }

    const event = await Event.findById(eventId);
    if (event) {
      // only push if they're not already a participant
      if (!event.participants.includes(userId)) {
        event.participants.push(userId);
        await event.save();
      }
    }

    // --- Add the event to the user's `eventsBooked` ---
    const user = await User.findById(userId);
    if (user) {
      if (!user.eventsBooked.includes(eventId)) {
        user.eventsBooked.push(eventId);
        await user.save();
      }
    }

    return res.json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Server error creating ticket" });
  }
});

// GET TICKETS
router.get("/tickets", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Find all tickets for this user
    const tickets = await Ticket.find({ userId }) // <-- Now it matches the schema
      .populate("eventId", "title"); // If you want to show event title

    return res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Server error fetching tickets" });
  }
});

module.exports = router;
