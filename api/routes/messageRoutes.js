const express = require("express");
const {
  sendMessage,
  getMessages,
  getLatestMessage,
} = require("../controllers/messageController");

const createMessageRouter = (io) => {
  const router = express.Router();

  // Pass io to each route handler that needs it
  router.post("/sendMessage", (req, res) => sendMessage(req, res, io));
  router.get("/messages", getMessages);
  router.get("/latestMessage", getLatestMessage);

  return router;
};

module.exports = createMessageRouter;
