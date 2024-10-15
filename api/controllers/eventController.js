const Event = require("../models/event");
const cloudinary = require("../utils/cloudinary"); // Import your Cloudinary configuration
const parser = require("../middlewares/upload");

const createEvent = async (req, res) => {
  console.log("Received a request to create an event");

  parser.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err.message);
      return res
        .status(400)
        .json({ error: "File upload error", message: err.message });
    }

    try {
      console.log("Request body:", req.body);
      console.log("Files received:", req.files);

      const {
        title,
        location,
        date,
        time,
        organizer,
        eventDetails,
        genre,
        artists,
        ticketPrice,
        images, // Already uploaded image URLs (optional)
        videoUrl,
      } = req.body;

      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        console.error("Invalid date format");
        return res.status(400).json({ error: "Invalid date format" });
      }

      // Upload images to Cloudinary
      const imageUploads = req.files.images
        ? Promise.all(
            req.files.images.map(async (file) => {
              console.log("Uploading image:", file.path);
              const result = await cloudinary.uploader.upload(file.path, {
                folder: "images", // Optional folder name in Cloudinary
              });
              return { url: result.secure_url };
            })
          )
        : // : [];
          images || [];

      // Upload video to Cloudinary (if any)
      let videoUploadUrl = "";
      if (req.files.video && req.files.video[0]) {
        console.log("Uploading video:", req.files.video[0].path);
        const videoUploadResult = await cloudinary.uploader.upload(
          req.files.video[0].path,
          {
            resource_type: "video", // Specify video upload
            folder: "videos", // Optional folder name in Cloudinary
          }
        );
        videoUploadUrl = videoUploadResult.secure_url;
      } else {
        videoUploadUrl = videoUrl || ""; // Use the provided URL if no video is uploaded
      }

      // const images = await imageUploads;
      console.log("Uploaded images:", imageUploads);
      console.log("Uploaded video URL:", videoUploadUrl);

      const newEvent = new Event({
        userId: req.user.userId,
        title,
        date: eventDate,
        time,
        organizer: organizer || req.user.userId,
        eventDetails,
        genre,
        // artists: artists ? JSON.parse(artists) : [],
        artists: typeof artists === "string" ? JSON.parse(artists) : artists,
        location,
        images: imageUploads,
        videoUrl: videoUploadUrl,
        ticketPrice: parseFloat(ticketPrice),
      });

      // Save the new event
      await newEvent.save();
      console.log("Event created:", newEvent);

      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error.message, error.stack);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

// const createEvent = async (req, res) => {
//   console.log("Received a request to create an event");

//   parser.fields([
//     { name: "images", maxCount: 10 },
//     { name: "video", maxCount: 1 },
//   ])(req, res, async (err) => {
//     if (err) {
//       console.error("File upload error:", err.message);
//       return res
//         .status(400)
//         .json({ error: "File upload error", message: err.message });
//     }

//     try {
//       console.log("Request body:", req.body);
//       console.log("Files received:", req.files);

//       const {
//         title,
//         locationAddress, // Address as string
//         longitude, // Longitude of the event location
//         latitude, // Latitude of the event location
//         date,
//         time,
//         organizer,
//         eventDetails,
//         genre,
//         artists,
//         ticketPrice,
//         images, // Already uploaded image URLs (optional)
//         videoUrl,
//       } = req.body;

//       // Parse the event date
//       const eventDate = new Date(date);
//       if (isNaN(eventDate.getTime())) {
//         console.error("Invalid date format");
//         return res.status(400).json({ error: "Invalid date format" });
//       }

//       // Ensure both latitude and longitude are provided
//       if (!longitude || !latitude) {
//         return res
//           .status(400)
//           .json({ error: "Longitude and latitude are required for location" });
//       }

//       // Upload images to Cloudinary
//       const imageUploads = req.files.images
//         ? Promise.all(
//             req.files.images.map(async (file) => {
//               console.log("Uploading image:", file.path);
//               const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "images", // Optional folder name in Cloudinary
//               });
//               return { url: result.secure_url };
//             })
//           )
//         : images || [];

//       // Upload video to Cloudinary (if any)
//       let videoUploadUrl = "";
//       if (req.files.video && req.files.video[0]) {
//         console.log("Uploading video:", req.files.video[0].path);
//         const videoUploadResult = await cloudinary.uploader.upload(
//           req.files.video[0].path,
//           {
//             resource_type: "video", // Specify video upload
//             folder: "videos", // Optional folder name in Cloudinary
//           }
//         );
//         videoUploadUrl = videoUploadResult.secure_url;
//       } else {
//         videoUploadUrl = videoUrl || ""; // Use the provided URL if no video is uploaded
//       }

//       console.log("Uploaded images:", imageUploads);
//       console.log("Uploaded video URL:", videoUploadUrl);

//       // Prepare the new event object
//       const newEvent = new Event({
//         userId: req.user.userId,
//         title,
//         date: eventDate,
//         time,
//         organizer: organizer || req.user.userId,
//         eventDetails,
//         genre,
//         artists: typeof artists === "string" ? JSON.parse(artists) : artists,
//         location: {
//           type: "Point",
//           coordinates: [parseFloat(longitude), parseFloat(latitude)], // Store coordinates as [longitude, latitude]
//           address: locationAddress, // Store the location address
//         },
//         images: await imageUploads,
//         videoUrl: videoUploadUrl,
//         ticketPrice: parseFloat(ticketPrice),
//       });

//       // Save the new event
//       await newEvent.save();
//       console.log("Event created:", newEvent);

//       res
//         .status(201)
//         .json({ message: "Event created successfully", event: newEvent });
//     } catch (error) {
//       console.error("Error creating event:", error.message, error.stack);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

// Controller to get all events for a specific user

const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId });
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get events", message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    console.log("Fetching all events...");

    const events = await Event.find({});

    // console.log("Events retrieved:", events);

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching all events:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params; // Get event ID from request parameters

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to handle likes
const likeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const alreadyLiked = event.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the event
      event.likes = event.likes.filter((like) => like.toString() !== userId);
    } else {
      // Like the event
      event.likes.push(userId);
    }

    await event.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: event.likes.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error liking the event", message: error.message });
  }
};

// Controller to handle comments
const addComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const newComment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    event.comments.push(newComment);

    await event.save();

    res
      .status(201)
      .json({ message: "Comment added", comments: event.comments });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding comment", message: error.message });
  }
};

// Controller to handle views
const incrementViews = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.views += 1;
    await event.save();

    res.status(200).json({ message: "View incremented", views: event.views });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error incrementing views", message: error.message });
  }
};

// Controller to handle shares
const shareEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.shares.push(userId);
    await event.save();

    res
      .status(200)
      .json({ message: "Event shared", sharesCount: event.shares.length });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error sharing the event", message: error.message });
  }
};

module.exports = {
  createEvent,
  getUserEvents,
  getAllEvents,
  getEventById,
  likeEvent,
  addComment,
  incrementViews,
  shareEvent,
};
