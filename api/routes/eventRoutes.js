const express = require("express");
const {
  createEvent,
  getUserEvents,
  getAllEvents,
} = require("../controllers/eventController"); // Adjust the path if necessary
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

const router = express.Router();

// Route to create an event
router.post("/events", authenticateToken, createEvent);
router.get("/getEvents", getUserEvents);
router.get("/all-events", getAllEvents);

module.exports = router;
