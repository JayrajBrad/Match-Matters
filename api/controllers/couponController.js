const User = require("../models/user");
const Event = require("../models/event");
const Coupon = require("../models/coupon");

const generateCouponCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const cancelEvent = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticketPrice = event.ticketPrice;

    // Remove event from user and participants
    await User.findByIdAndUpdate(userId, { $pull: { eventsBooked: eventId } });
    await Event.findByIdAndUpdate(eventId, { $pull: { participants: userId } });

    // Generate and save the coupon
    const coupon = new Coupon({
      userId,
      value: ticketPrice,
      code: generateCouponCode(),
      eventId,
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1-month expiry
    });
    await coupon.save();

    res.status(200).json({
      message: "Event canceled successfully, and coupon generated.",
      coupon,
    });
  } catch (error) {
    console.error("Error canceling event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCoupon = async (req, res) => {
  const { userId } = req.params;

  try {
    const coupons = await Coupon.find({ userId, isRedeemed: false }).sort({
      expiryDate: 1,
    }); // Sort by nearest expiry date
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const cancelEvent = async (req, res) => {
//   const { userId, eventId } = req.params;
//   const { ticketPrice } = req.body; // Get ticketPrice from the request body

//   try {
//     // Find the event to get the ticket price
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Validate the ticket price if sent from the frontend
//     if (ticketPrice && ticketPrice !== event.ticketPrice) {
//       return res
//         .status(400)
//         .json({ message: "Ticket price does not match the event details." });
//     }

//     // Continue with cancellation logic
//     const actualTicketPrice = event.ticketPrice;

//     // Remove the event ID from the user's booked events
//     await User.findByIdAndUpdate(userId, {
//       $pull: { eventsBooked: eventId },
//     });

//     // Remove the user ID from the event's participants
//     await Event.findByIdAndUpdate(eventId, {
//       $pull: { participants: userId },
//     });

//     // Generate a coupon with the ticket price
//     const coupon = new Coupon({
//       userId,
//       value: actualTicketPrice,
//       eventId,
//       expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1-month expiry
//     });
//     await coupon.save();

//     res.status(200).json({
//       message: "Event canceled successfully, and coupon generated.",
//       coupon,
//     });
//   } catch (error) {
//     console.error("Error canceling event:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports = { cancelEvent, getCoupon };
