// // const Event = require("../models/event");
// // const mongoose = require("mongoose");
// // const MostHappening = require("../models/MostHappening");

// // const User = require("../models/user");
// // const cloudinary = require("../utils/cloudinary"); // Import your Cloudinary configuration
// // const parser = require("../middlewares/upload");
// // const moment = require("moment");

// // const vibeEvent = async (req, res) => {
// //   try {
// //     const { eventId } = req.params;
// //     const { userId } = req.body; // Or wherever you're getting the user
// //     console.log(userId);

// //     if (!userId) {
// //       return res.status(400).json({ error: "No userId provided" });
// //     }

// //     const event = await Event.findById(eventId);
// //     if (!event) {
// //       return res.status(404).json({ error: "Event not found" });
// //     }

// //     // Check if user already vibed
// //     const alreadyVibed = event.vibes.some(
// //       (vibeUserId) => vibeUserId.toString() === userId.toString()
// //     );

// //     if (alreadyVibed) {
// //       // If user has already vibed, "unvibe"
// //       event.vibes = event.vibes.filter(
// //         (vibeUserId) => vibeUserId.toString() !== userId.toString()
// //       );
// //     } else {
// //       // If user hasn't vibed, add them
// //       event.vibes.push(userId);
// //     }

// //     await event.save();

// //     // Update the MostHappening collection
// //     const eventVibesCount = event.vibes.length;

// //     // Find the 25th most vibed event
// //     const fifteenthMostVibed = await MostHappening.find({})
// //       .sort({ vibesCount: -1 })
// //       .skip(24)
// //       .limit(1)
// //       .lean();

// //     if (
// //       !fifteenthMostVibed.length ||
// //       eventVibesCount > fifteenthMostVibed[0].vibesCount
// //     ) {
// //       // Event qualifies to be in MostHappening
// //       // Upsert the event
// //       await MostHappening.findOneAndUpdate(
// //         { eventId: event._id },
// //         { eventId: event._id, vibesCount: eventVibesCount },
// //         { upsert: true, new: true }
// //       );

// //       // Ensure MostHappening has only top 25
// //       await MostHappening.find({})
// //         .sort({ vibesCount: -1 })
// //         .skip(25)
// //         .deleteMany({});
// //     }

// //     return res.status(200).json({
// //       message: "Vibe toggled successfully",
// //       vibesCount: event.vibes.length,
// //       vibes: event.vibes, // Optionally return updated vibes array
// //     });
// //   } catch (error) {
// //     console.error("Error in vibeEvent:", error);
// //     return res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // /**
// //  * Get Most Happening Events from the MostHappening collection
// //  */
// // // const getMostHappening = async (req, res) => {
// // //   try {

// // //     const mostHappeningListdata = await MostHappening.find({});
// // //     const mostHappeningList = await MostHappening.find({})
// // //       .sort({ vibesCount: -1 })
// // //       .limit(25)
// // //       .populate("eventId") // populates the full Event document into `entry.eventId`
// // //       .lean();

// // //       console.log("MHD",mostHappeningListdata)

// // //     // We just return the event details plus the vibesCount from MostHappening
// // //     const events = mostHappeningList.map((entry) => {
// // //       const eventDoc = entry.eventId; // the populated Event
// // //       return {
// // //         ...eventDoc,
// // //         vibesCount: entry.vibesCount,
// // //       };
// // //     });

// // //     return res.status(200).json({ events });
// // //   } catch (error) {
// // //     console.error("Error fetching most happening events:", error.response?.data || error.message);

// // //     return res.status(500).json({ error: "Internal server error" });
// // //   }
// // // };

// // const getMostHappening = async (req, res) => {
// //   try {
// //     console.log("Fetching most happening events...");

// //     // Fetch the most happening events with populated eventId
// //     const mostHappeningList = await MostHappening.find({})
// //       .sort({ vibesCount: -1 })
// //       .limit(25)
// //       .populate("eventId")  // Populate the eventId field with the Event details
// //       .lean();

// //     if (mostHappeningList.length === 0) {
// //       return res.status(404).json({ error: "No most happening events found." });
// //     }

// //     // Map the populated events
// //     const events = mostHappeningList.map((entry) => {
// //       if (!entry.eventId) {
// //         console.warn("Missing eventId in MostHappening entry:", entry);
// //         return null;
// //       }

// //       return {
// //         ...entry.eventId, // Spread event details from the populated eventId document
// //         vibesCount: entry.vibesCount, // Include the vibesCount from the MostHappening collection
// //       };
// //     }).filter(Boolean); // Remove any null entries from the mapping

// //     if (events.length === 0) {
// //       return res.status(404).json({ error: "No valid events found." });
// //     }

// //     console.log("Trending events:", events);
// //     return res.status(200).json({
// //       message: "Trending events fetched successfully.",
// //       events,
// //     });

// //   } catch (error) {
// //     console.error("Error in getMostHappening:", error.message, error.stack);
// //     return res.status(500).json({ error: "Internal server error" });
// //   }
// // };




// // module.exports = { getMostHappening };


// // module.exports = {
// //   getMostHappening,
// //   vibeEvent,
// // };



// // controllers/eventController.js

// const Event = require("../models/event");
// const mongoose = require("mongoose");
// const MostHappening = require("../models/MostHappening");
// const User = require("../models/user");
// const cloudinary = require("../utils/cloudinary"); // Import your Cloudinary configuration
// const parser = require("../middlewares/upload");
// const moment = require("moment");

// const vibeEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { userId } = req.body; // Or wherever you're getting the user
//     console.log("User ID:", userId);

//     if (!userId) {
//       return res.status(400).json({ error: "No userId provided" });
//     }

//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Check if user already vibed
//     const alreadyVibed = event.vibes.some(
//       (vibeUserId) => vibeUserId.toString() === userId.toString()
//     );

//     if (alreadyVibed) {
//       // If user has already vibed, "unvibe"
//       event.vibes = event.vibes.filter(
//         (vibeUserId) => vibeUserId.toString() !== userId.toString()
//       );
//     } else {
//       // If user hasn't vibed, add them
//       event.vibes.push(userId);
//     }

//     await event.save();

//     // Update the MostHappening collection
//     const eventVibesCount = event.vibes.length;

//     // Find the 25th most vibed event
//     const twentyFifthMostVibed = await MostHappening.find({})
//       .sort({ vibesCount: -1 })
//       .skip(24)
//       .limit(1)
//       .lean();

//     if (
//       !twentyFifthMostVibed.length ||
//       eventVibesCount > twentyFifthMostVibed[0].vibesCount
//     ) {
//       // Event qualifies to be in MostHappening
//       // Upsert the event
//       await MostHappening.findOneAndUpdate(
//         { eventId: event._id },
//         { eventId: event._id, vibesCount: eventVibesCount },
//         { upsert: true, new: true }
//       );

//       // Ensure MostHappening has only top 25
//       const excessEntries = await MostHappening.find({})
//         .sort({ vibesCount: -1 })
//         .skip(25)
//         .select("_id")
//         .lean();

//       const excessIds = excessEntries.map((entry) => entry._id);

//       if (excessIds.length > 0) {
//         await MostHappening.deleteMany({ _id: { $in: excessIds } });
//       }
//     } else if (alreadyVibed) {
//       // If unvibed and event is in MostHappening, update or remove it
//       const mostHappeningEntry = await MostHappening.findOne({ eventId: event._id });
//       if (mostHappeningEntry) {
//         if (eventVibesCount < twentyFifthMostVibed[0].vibesCount) {
//           // Remove from MostHappening
//           await MostHappening.deleteOne({ eventId: event._id });
//         } else {
//           // Update the vibesCount
//           mostHappeningEntry.vibesCount = eventVibesCount;
//           await mostHappeningEntry.save();
//         }
//       }
//     }

//     return res.status(200).json({
//       message: "Vibe toggled successfully",
//       vibesCount: event.vibes.length,
//       vibes: event.vibes, // Optionally return updated vibes array
//     });
//   } catch (error) {
//     console.error("Error in vibeEvent:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * Get Most Happening Events from the MostHappening collection
//  */
// const getMostHappening = async (req, res) => {
//   try {
//     console.log("getMostHappening controller triggered");
//     const mostHappeningList = await MostHappening.find({})
//       .sort({ vibesCount: -1 })
//       .limit(25)
//       .populate("eventId") // populates the full Event document into entry.eventId
//       .lean();

//     console.log("Most Happening List:", mostHappeningList);

//     // We just return the event details plus the vibesCount from MostHappening
//     const events = mostHappeningList.map((entry) => {
//       const eventDoc = entry.eventId; // the populated Event
//       return {
//         ...eventDoc,
//         vibesCount: entry.vibesCount,
//       };
//     });

//     return res.status(200).json({ events });
//   } catch (error) {
//     console.error("Error in getMostHappening:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   getMostHappening,
//   vibeEvent,
// };


// controllers/eventController.js

const Event = require("../models/event");
const MostHappening = require("../models/MostHappening");

const vibeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // Ensure userId is correctly sent in the request body
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Toggle vibe
    const alreadyVibed = event.vibes.some(
      (vibeUserId) => vibeUserId.toString() === userId.toString()
    );

    if (alreadyVibed) {
      // If user has already vibed, "unvibe"
      event.vibes = event.vibes.filter(
        (vibeUserId) => vibeUserId.toString() !== userId.toString()
      );
    } else {
      // If user hasn't vibed, add them
      event.vibes.push(userId);
    }

    await event.save();

    // Update the MostHappening collection
    const eventVibesCount = event.vibes.length;

    // Find the 25th most vibed event
    const twentyFifthMostVibed = await MostHappening.find({})
      .sort({ vibesCount: -1 })
      .skip(24)
      .limit(1)
      .lean();

    if (
      !twentyFifthMostVibed.length ||
      eventVibesCount > twentyFifthMostVibed[0].vibesCount
    ) {
      // Event qualifies to be in MostHappening
      // Upsert the event
      await MostHappening.findOneAndUpdate(
        { eventId: event._id },
        { eventId: event._id, vibesCount: eventVibesCount },
        { upsert: true, new: true }
      );

      // Ensure MostHappening has only top 25
      const excessEntries = await MostHappening.find({})
        .sort({ vibesCount: -1 })
        .skip(25)
        .select("_id")
        .lean();

      const excessIds = excessEntries.map((entry) => entry._id);

      if (excessIds.length > 0) {
        await MostHappening.deleteMany({ _id: { $in: excessIds } });
      }
    } else if (alreadyVibed) {
      // If unvibed and event is in MostHappening, update or remove it
      const mostHappeningEntry = await MostHappening.findOne({
        eventId: event._id,
      });
      if (mostHappeningEntry) {
        if (eventVibesCount < twentyFifthMostVibed[0].vibesCount) {
          // Remove from MostHappening
          await MostHappening.deleteOne({ eventId: event._id });
        } else {
          // Update the vibesCount
          mostHappeningEntry.vibesCount = eventVibesCount;
          await mostHappeningEntry.save();
        }
      }
    }

    return res.status(200).json({
      message: "Vibe toggled successfully",
      vibesCount: event.vibes.length,
      vibes: event.vibes, // Optionally return updated vibes array
    });
  } catch (error) {
    console.error("Error in vibeEvent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMostHappening = async (req, res) => {
  try {
    console.log("getMostHappening controller triggered");
    const mostHappeningList = await MostHappening.find({})
      .sort({ vibesCount: -1 })
      .limit(25)
      .populate("eventId") // Populates the full Event document into entry.eventId
      .lean();

    console.log("Most Happening List:", mostHappeningList);

    // Return the event details plus the vibesCount from MostHappening
    const events = mostHappeningList.map((entry) => {
      const eventDoc = entry.eventId; // the populated Event
      return {
        ...eventDoc,
        vibesCount: entry.vibesCount,
      };
    });

    return res.status(200).json({ events });
  } catch (error) {
    console.error("Error in getMostHappening:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMostHappening,
  vibeEvent,
};