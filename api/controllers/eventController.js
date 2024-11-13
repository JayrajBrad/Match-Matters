const Event = require("../models/event");
const mongoose = require("mongoose");
const User = require("../models/user");
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

      const { userId } = req.body;
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
      // console.log("Uploaded images:", imageUploads);
      // console.log("Uploaded video URL:", videoUploadUrl);

      const newEvent = new Event({
        userId: userId,
        title,
        date: eventDate,
        time,
        organizer: organizer || userId,
        eventDetails,
        genre,
        // artists: artists ? JSON.parse(artists) : [],
        artists: typeof artists === "string" ? JSON.parse(artists) : artists,
        location: {
          baseAddress: location.baseAddress,
          city: location.city,
          state: location.state,
          country: location.country,
          coordinates: [location.longitude, location.latitude],
        },
        images: imageUploads,
        videoUrl: videoUploadUrl,
        ticketPrice: parseFloat(ticketPrice),
      });

      // Save the new event
      await newEvent.save();
      console.log("Event created:", newEvent);

      // After the event is created
      try {
        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
          console.error("User not found with id:", userId);
          return res.status(404).json({ error: "User not found" });
        }

        // Update the user to push the new event ID into the `createdEvents` array
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $push: { createdEvents: newEvent._id } },
          { new: true }
        );

        if (!updatedUser) {
          console.error("Failed to update user with id:", userId);
          return res
            .status(500)
            .json({ error: "Failed to update user with new event" });
        }

        console.log("User successfully updated with new event:", updatedUser);
      } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: "Internal server error" });
      }

      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error.message, error.stack);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

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

const getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Request params:", req.params);
    // const userId = req.user.userId; // Use the logged-in user's ID
    // console.log("Fetching events for user ID:", userId);
    // Get user ID from request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching events for user ID:", userId);
    const events = await Event.find({ userId }); // Assuming 'userId' is the field in your Event model
    console.log("Events fetched:", events);
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(
      "Error fetching events by user ID:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

/////dont delete for now/////////
const getEventById = async (req, res) => {
  const eventId = req.params.eventId;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event ID" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getEventsByLocation = async (req, res) => {
  const { city, state, country } = req.params; // Get parameters from URL

  // console.log("getEventsByLocation called with params:", req.params); // Log incoming parameters

  const query = {};
  if (city) {
    query["location.city"] = city;
  }
  if (state) {
    query["location.state"] = state;
  }
  if (country) {
    query["location.country"] = country;
  }

  // console.log("Constructed query:", query); // Log constructed query

  try {
    const events = await Event.find(query);
    // console.log("Fetched events:", events); // Log fetched events

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this location." });
    }

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events." });
  }
};

const getEventsByGenre = async (req, res) => {
  const { genre } = req.params; // Get genre from URL parameters

  console.log("getEventsByGenre called with params:", req.params);
  if (!genre) {
    return res.status(400).json({ error: "Genre is required" });
  }

  try {
    const events = await Event.find({ genre }); // Find events by genre
    console.log("Fetched events by genre:", events); // Log fetched events

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this genre." });
    }

    res.json(events);
  } catch (error) {
    console.error("Error fetching events by genre:", error.message);
    res.status(500).json({ message: "Error fetching events." });
  }
};

const getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params; // Extract from params instead of query

    // Ensure that both dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Both startDate and endDate parameters are required",
      });
    }

    // Parse the dates and validate them
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error:
          "Invalid date format. Please use a valid date format (YYYY-MM-DD).",
      });
    }

    // Adjust the end date to include the entire day
    end.setHours(23, 59, 59, 999);

    // Query events that fall within the specified date range
    const events = await Event.find({
      date: {
        $gte: start, // Greater than or equal to start date
        $lte: end, // Less than or equal to end date
      },
    });

    // If no events found, return a 404
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found in this date range." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(
      "Error fetching events by date range:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const registerForEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.body.userId || req.user.id;

  console.log("User ID:", userId);
  console.log("Event ID:", eventId);

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" }); // Send 404 if event is not found
    }

    // Check if user is already registered for the event
    if (event.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already registered for this event" }); // Send 400 if already registered
    }

    // Add user to event participants
    event.participants.push(userId);
    await event.save();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found
    }

    // Initialize eventsBooked if it doesn't exist
    if (!user.eventsBooked) {
      user.eventsBooked = []; // Ensure eventsBooked is an array
    }

    // Add event to user's booked events
    user.eventsBooked.push(eventId);
    await user.save();

    return res.status(200).json({ message: "User registered successfully" }); // Successful registration
  } catch (error) {
    console.error("Error registering for event:", error); // Log the error
    return res
      .status(500)
      .json({ message: "An error occurred while registering for the event" }); // Handle generic server error
  }
};

const getEventParticipants = async (req, res) => {
  const { eventId } = req.params; // Get event ID from the request parameters

  try {
    // Find the event by ID
    // const event = await Event.findById(eventId);
    const event = await Event.findById(eventId).populate("participants");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Return the participants of the event
    return res.status(200).json(event.participants);
  } catch (error) {
    console.error("Error retrieving event participants:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getNearbyEvents = async (req, res) => {
  const { city, state, country, latitude, longitude, maxDistance } = req.params;

  // Parse the coordinates and maxDistance
  const parsedLongitude = parseFloat(longitude);
  const parsedLatitude = parseFloat(latitude);
  let parsedMaxDistance = parseInt(maxDistance, 10) || 1000000; // Default to 1000 if invalid
  // console.log("Parsed coordinates:", { parsedLongitude, parsedLatitude });

  // Validate coordinates
  if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
    return res.status(400).json({ error: "Invalid latitude or longitude" });
  }

  try {
    let events = await Event.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude], // Ensure correct order
          },
          $maxDistance: parsedMaxDistance,
        },
      },
      "location.city": city,
      "location.state": state,
      "location.country": country,
    });

    // Check if less than 5 events are found
    if (events.length < 5) {
      // Fetch additional nearby events without filtering by city
      const nearbyEvents = await Event.find({
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parsedLongitude, parsedLatitude],
            },
            $maxDistance: parsedMaxDistance,
          },
        },
      });

      // Merge the two arrays while avoiding duplicates
      events = [
        ...events,
        ...nearbyEvents.filter(
          (ne) => !events.some((e) => e._id.equals(ne._id))
        ),
      ];
    }

    // console.log("from nearby events :", events);

    res.status(200).json(events);
  } catch (error) {
    console.error("Error in getNearbyEvents controller:", error);
    res.status(500).json({ error: "Failed to fetch nearby events" });
  }
};

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
  getEventsByUserId,
  getEventsByDateRange,
  getEventsByGenre,
  registerForEvent,
  getEventParticipants,
  getNearbyEvents,
  likeEvent,
  addComment,
  incrementViews,
  shareEvent,
  getEventsByLocation,
};
