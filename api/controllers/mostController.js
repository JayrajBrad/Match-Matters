const Event = require("../models/event");
const mongoose = require("mongoose");
const MostHappening = require("../models/MostHappening");

const User = require("../models/user");
const cloudinary = require("../utils/cloudinary"); // Import your Cloudinary configuration
const parser = require("../middlewares/upload");
const moment = require("moment");

const vibeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // Or wherever you're getting the user
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user already vibed
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
    const fifteenthMostVibed = await MostHappening.find({})
      .sort({ vibesCount: -1 })
      .skip(24)
      .limit(1)
      .lean();

    if (
      !fifteenthMostVibed.length ||
      eventVibesCount > fifteenthMostVibed[0].vibesCount
    ) {
      // Event qualifies to be in MostHappening
      // Upsert the event
      await MostHappening.findOneAndUpdate(
        { eventId: event._id },
        { eventId: event._id, vibesCount: eventVibesCount },
        { upsert: true, new: true }
      );

      // Ensure MostHappening has only top 25
      await MostHappening.find({})
        .sort({ vibesCount: -1 })
        .skip(25)
        .deleteMany({});
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

/**
 * Get Most Happening Events from the MostHappening collection
 */
const getMostHappening = async (req, res) => {
  try {
    const mostHappeningList = await MostHappening.find({})
      .sort({ vibesCount: -1 })
      .limit(25)
      .populate("eventId") // populates the full Event document into `entry.eventId`
      .lean();

    // We just return the event details plus the vibesCount from MostHappening
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
