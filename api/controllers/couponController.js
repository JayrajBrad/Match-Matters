// const User = require("../models/user");
// const Event = require("../models/event");
// const Coupon = require("../models/coupon");

// const generateCouponCode = () => {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let code = "";
//   for (let i = 0; i < 10; i++) {
//     code += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return code;
// };

// const cancelEvent = async (req, res) => {
//   const { userId, eventId } = req.params;

//   try {
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const ticketPrice = event.ticketPrice;

//     // Remove event from user and participants
//     await User.findByIdAndUpdate(userId, { $pull: { eventsBooked: eventId } });
//     await Event.findByIdAndUpdate(eventId, { $pull: { participants: userId } });

//     // Generate and save the coupon
//     const coupon = new Coupon({
//       userId,
//       value: ticketPrice,
//       code: generateCouponCode(),
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

// const getCoupon = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const coupons = await Coupon.find({ userId, isRedeemed: false }).sort({
//       expiryDate: 1,
//     }); // Sort by nearest expiry date
//     res.status(200).json(coupons);
//   } catch (error) {
//     console.error("Error fetching coupons:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { cancelEvent, getCoupon };

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

    // 1) Remove the event from the user who is canceling
    await User.findByIdAndUpdate(userId, {
      $pull: { eventsBooked: eventId },
    });

    // 2) Remove the event from ALL participants in their eventsBooked
    //    (only do this if you truly intend to remove it for everyone)
    await User.updateMany(
      { eventsBooked: eventId },
      { $pull: { eventsBooked: eventId } }
    );

    // 3) Actually delete the event from the Events collection
    //    (again, do this if the event is fully canceled for all)
    await Event.findByIdAndDelete(eventId);

    // 4) Generate and save the coupon
    const coupon = new Coupon({
      userId,
      value: ticketPrice,
      code: generateCouponCode(),
      eventId,
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1-month expiry
    });
    await coupon.save();

    res.status(200).json({
      message: "Event canceled and removed from database. Coupon generated.",
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
    });
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { cancelEvent, getCoupon };
