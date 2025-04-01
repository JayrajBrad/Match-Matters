// controllers/eventController.js

const Event = require("../models/event");
const MostHappening = require("../models/MostHappening");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

// const getMostHappening = async (req, res) => {
//   try {
//     console.log("getMostHappening controller triggered");
//     const mostHappeningList = await MostHappening.find({})
//       .sort({ vibesCount: -1 })
//       .limit(25)
//       .populate("eventId") // Populates the full Event document into entry.eventId
//       .lean();

//     console.log("Most Happening List:", mostHappeningList);

//     // Return the event details plus the vibesCount from MostHappening
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

const getMostHappening = async (req, res) => {
  try {
    console.log("getMostHappening controller triggered");

    const mostHappeningList = await MostHappening.find({})
      .sort({ vibesCount: -1 }) // Sort by highest vibesCount
      .limit(25)
      .populate("eventId") // Populate the full Event document into entry.eventId
      .lean();

    console.log("Most Happening List:", mostHappeningList);

    // Generate presigned URLs for each event's video and image
    const eventsWithPresignedUrls = await Promise.all(
      mostHappeningList.map(async (entry) => {
        const eventDoc = entry.eventId; // Populated Event document
        if (!eventDoc) return null;

        let presignedVideoUrl = null;
        let presignedImageUrl = null;

        // Generate presigned URL for video (if exists)
        if (eventDoc.videoUrl) {
          try {
            const videoCommand = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: eventDoc.videoUrl, // e.g. "mm_videos/abc123.mp4"
            });
            presignedVideoUrl = await getSignedUrl(s3Client, videoCommand, {
              expiresIn: 86400, // 24 hours
            });
          } catch (err) {
            console.error(
              "Error generating presigned URL for video:",
              eventDoc.videoUrl,
              err
            );
          }
        }

        // Generate presigned URL for first image (if exists)
        if (eventDoc.images && eventDoc.images.length > 0) {
          try {
            const firstImage = eventDoc.images[0];
            const imageKey =
              typeof firstImage === "string" ? firstImage : firstImage.url;

            const imageCommand = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: imageKey, // e.g. "mm_images/xyz.jpg"
            });
            presignedImageUrl = await getSignedUrl(s3Client, imageCommand, {
              expiresIn: 86400, // 24 hours
            });
          } catch (err) {
            console.error(
              "Error generating presigned URL for image:",
              eventDoc.images[0],
              err
            );
          }
        }

        return {
          ...eventDoc,
          vibesCount: entry.vibesCount, // Attach vibesCount from MostHappening model
          presignedVideoUrl, // Include presigned video URL
          presignedImageUrl, // Include presigned image URL
        };
      })
    );

    // Remove any null values (in case of missing event data)
    const filteredEvents = eventsWithPresignedUrls.filter((event) => event);

    return res.status(200).json({
      events: filteredEvents,
      totalCount: filteredEvents.length,
    });
  } catch (error) {
    console.error("Error in getMostHappening:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMostHappening,
  vibeEvent,
};
