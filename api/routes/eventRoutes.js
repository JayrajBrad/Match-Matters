// // const express = require("express");
// // const {
// //   createEvent,
// //   getUserEvents,
// //   getAllEvents,
// //   getEventById,
// //   getEventsByUserId,
// //   getEventsByDateRange,
// //   getEventsByLocationAndDateRange,
// //   getEventsByGenre,
// //   getEventsByRadius,
// //   registerForEvent,
// //   getEventParticipants,
// //   getNearbyEvents,
// //   deleteEvents,
// //   getEventsByLocation,
// // } = require("../controllers/eventController"); // Adjust the path if necessary
// // const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

// // const router = express.Router();

// // // Route to create an event
// // router.post("/events", authenticateToken, createEvent);
// // router.get("/getEvents", getUserEvents);
// // router.get("/all-events", getAllEvents);
// // router.get("/events/:eventId", getEventById);
// // router.post("/events/:eventId/register", authenticateToken, registerForEvent);
// // router.get("/events/:eventId/participants", getEventParticipants);
// // router.get(
// //   "/events/nearby/:city/:state/:country/:latitude/:longitude/:maxDistance",
// //   getNearbyEvents
// // );
// // router.get("/events/nearby/:latitude/:longitude/:radius", getEventsByRadius);

// // router.get("/:userId/events", getEventsByUserId);

// // router.get("/events/location/:city/:state/:country", getEventsByLocation);
// // router.get("/events/genre/:genre", getEventsByGenre);

// // router.get("/events/filterByDate/:startDate/:endDate", getEventsByDateRange);
// // router.get(
// //   "/events/locationAndDateRange/:city/:state/:country/:startDate/:endDate",
// //   getEventsByLocationAndDateRange
// // );

// // router.post("/events/delete", deleteEvents);

// // module.exports = router;

// // routes/eventRoutes.js

// const express = require("express");
// const router = express.Router();
// const authenticateToken = require("../middlewares/authenticateToken");

// // Controllers
// const {
//   createEvent,
//   getUserEvents,
//   getAllEvents,

//   registerForEvent,
//   getEventParticipants,

//   updateEvent,
//   deleteEvents,
// } = require("../controllers/eventController");

// const {
//   getEventById,
//   getEventsByUserId,
//   getEventsByDateRange,
//   getEventsByLocationAndDateRange,
//   getEventsByGenre,
//   getEventsByRadius,
//   getCombinedEvents,
//   getNearbyEvents,

//   getEventsByLocation,
// } = require("../controllers/videoController");

// const {
//   getMostHappening,
//   vibeEvent,
// } = require("../controllers/mostController");

// // Create event
// router.post("/events", authenticateToken, createEvent);
// router.patch("/events/updateEvent/:eventId", authenticateToken, updateEvent);

// // Original user events route (not paginated sample)
// router.get("/getEvents", getUserEvents);

// // All events route (you may also add pagination)
// router.get("/all-events", getAllEvents);

// // Register, participants
// router.post("/events/:eventId/register", authenticateToken, registerForEvent);
// router.get("/events/:eventId/participants", getEventParticipants);

// // Delete events
// router.post("/events/delete", deleteEvents);

// // VIDEO CONTROLLER //

// router.get("/events/combined", getCombinedEvents);

// // Single event by ID ;;;;;;;;;;;;;;;;
// router.get("/events/:eventId", getEventById);

// // Nearby events (supports ?page=1&limit=10);;;;;;;;;;;;;;
// router.get(
//   "/events/nearby/:city/:state/:country/:latitude/:longitude/:maxDistance",
//   getNearbyEvents
// );

// // Location-based events (supports ?page=1&limit=10);;;;;;;;;;;;;
// router.get("/events/location/:city/:state/:country", getEventsByLocation);

// // ;;;;;;;;;;;;;;;;
// router.get("/events/nearby/:latitude/:longitude/:radius", getEventsByRadius);

// // Events by user ID (supports ?page=1&limit=10);;;;;;;;;;;;;;;
// router.get("/:userId/events", getEventsByUserId);

// // Genre-based events (supports ?page=1&limit=10);;;;;;;;;;;;;;
// router.get("/events/genre/:genre", getEventsByGenre);

// // Date-based events (supports ?page=1&limit=10);;;;;;;;;;;;;;;
// router.get("/events/filterByDate/:startDate/:endDate", getEventsByDateRange);

// // Location + date-based events (supports ?page=1&limit=10);;;;;;;;;;;;;
// router.get(
//   "/events/locationAndDateRange/:city/:state/:country/:startDate/:endDate",
//   getEventsByLocationAndDateRange
// );

// // MOST HAPPENING //
// // "Vibe" an event
// router.post("/events/:eventId/vibe", vibeEvent);

// // Get most happening events
// router.get("/events/mh", getMostHappening);

// module.exports = router;

const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const authenticateToken = require("../middlewares/authenticateToken");

// Controllers
const {
  createEvent,
  getUserEvents,
  getAllEvents,

  registerForEvent,
  getEventParticipants,

  updateEvent,
  deleteEvents,
} = require("../controllers/eventController");

const {
  getEventById,
  getEventsByUserId,
  getEventsByDateRange,
  getEventsByLocationAndDateRange,
  getEventsByGenre,
  getEventsByRadius,
  getCombinedEvents,
  getNearbyEvents,

  getEventsByLocation,
} = require("../controllers/videoController");

const {
  getMostHappening,
  vibeEvent,
} = require("../controllers/mostController");

router.post("/events/:eventId/vibe", vibeEvent);

// Get most happening events
router.get("/events/most-happening", getMostHappening);

// Create event
router.post("/events", authenticateToken, createEvent);
router.patch("/events/updateEvent/:eventId", authenticateToken, updateEvent);

// Original user events route (not paginated sample)
router.get("/getEvents", getUserEvents);

// All events route (you may also add pagination)
router.get("/all-events", getAllEvents);

// Register, participants
router.post("/events/:eventId/register", authenticateToken, registerForEvent);
router.get("/events/:eventId/participants", getEventParticipants);

// Delete events
router.post("/events/delete", deleteEvents);

// VIDEO CONTROLLER //

router.get("/events/combined", getCombinedEvents);

// Single event by ID ;;;;;;;;;;;;;;;;
router.get("/events/:eventId", getEventById);

// Nearby events (supports ?page=1&limit=10);;;;;;;;;;;;;;
router.get(
  "/events/nearby/:city/:state/:country/:latitude/:longitude/:maxDistance",
  getNearbyEvents
);

// Location-based events (supports ?page=1&limit=10);;;;;;;;;;;;;
router.get("/events/location/:city/:state/:country", getEventsByLocation);

// ;;;;;;;;;;;;;;;;
router.get("/events/nearby/:latitude/:longitude/:radius", getEventsByRadius);

// Events by user ID (supports ?page=1&limit=10);;;;;;;;;;;;;;;
router.get("/:userId/events", getEventsByUserId);

// Genre-based events (supports ?page=1&limit=10);;;;;;;;;;;;;;
router.get("/events/genre/:genre", getEventsByGenre);

// Date-based events (supports ?page=1&limit=10);;;;;;;;;;;;;;;
router.get("/events/filterByDate/:startDate/:endDate", getEventsByDateRange);

// Location + date-based events (supports ?page=1&limit=10);;;;;;;;;;;;;
router.get(
  "/events/locationAndDateRange/:city/:state/:country/:startDate/:endDate",
  getEventsByLocationAndDateRange
);

router.get("/events/:eventId/booked", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId query parameter" });
    }

    // 1) Find the event by eventId
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 2) Check if userId is in event.participants
    const isBooked = event.participants.some(
      (participantId) => participantId.toString() === userId
    );

    // 3) Respond with a boolean, or an object indicating booked = true/false
    return res.json({ booked: isBooked });
  } catch (err) {
    console.error("Error checking booking:", err);
    return res.status(500).json({ error: "Server error checking booking" });
  }
});

// MOST HAPPENING //
// "Vibe" an event

module.exports = router;
