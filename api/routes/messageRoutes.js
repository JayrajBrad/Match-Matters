const express = require("express");
const {
  sendMessage,
  registerPushToken,
  removePushToken,
  getMessages,
  getLatestMessage,
} = require("../controllers/messageController");

const createMessageRouter = (io) => {
  const router = express.Router();

  // Pass io to each route handler that needs it
  router.post("/sendMessage", (req, res) => sendMessage(req, res, io));
  router.get("/messages", getMessages);
  router.get("/latestMessage", getLatestMessage);
// Register push token
router.post('/registerPushToken',registerPushToken);

// Remove push token
router.post('/removePushToken',removePushToken);

  return router;
};

module.exports = createMessageRouter;
