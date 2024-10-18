const express = require("express");
const {
  createEvent,
  getUserEvents,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  likeEvent,
  addComment,
  incrementViews,
  shareEvent,
} = require("../controllers/eventController"); // Adjust the path if necessary
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

const router = express.Router();

// Route to create an event
router.post("/events", authenticateToken, createEvent);
router.get("/getEvents", getUserEvents);
router.get("/all-events", getAllEvents);
router.get("/events/:id", getEventById);
router.get("/events/:userId'", getEventsByUserId);

// Interaction routes
router.post("/events/:eventId/like", authenticateToken, likeEvent); // Like/unlike event
router.post("/events/:eventId/comment", authenticateToken, addComment); // Add comment
router.post("/events/:eventId/view", incrementViews); // Increment views
router.post("/events/:eventId/share", authenticateToken, shareEvent); // Share event

module.exports = router;
