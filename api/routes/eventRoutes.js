const express = require("express");
const {
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
} = require("../controllers/eventController"); // Adjust the path if necessary
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

const router = express.Router();

// Route to create an event
router.post("/events", authenticateToken, createEvent);
router.get("/getEvents", getUserEvents);
router.get("/all-events", getAllEvents);
router.get("/events/:eventId", getEventById);
router.post("/events/:eventId/register", authenticateToken, registerForEvent);
router.get("/events/:eventId/participants", getEventParticipants);
router.get(
  "/events/nearby/:city/:state/:country/:latitude/:longitude/:maxDistance",
  getNearbyEvents
);

router.get("/:userId/events", getEventsByUserId);

router.get("/events/location/:city/:state/:country", getEventsByLocation);
router.get("/events/genre/:genre", getEventsByGenre);

router.get("/events/filterByDate/:startDate/:endDate", getEventsByDateRange);

// Interaction routes
router.post("/events/:eventId/like", authenticateToken, likeEvent); // Like/unlike event
router.post("/events/:eventId/comment", authenticateToken, addComment); // Add comment
router.post("/events/:eventId/view", incrementViews); // Increment views
router.post("/events/:eventId/share", authenticateToken, shareEvent); // Share event

module.exports = router;
