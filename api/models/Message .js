const mongoose = require("mongoose"); // Import mongoose

const MessageSchema = new mongoose.Schema({
  chatId: String, // Refers to a chat session
  senderId: String,
  recipientId: String, // Add the recipient ID
  text: String,
  media: String, // URL or path for media messages
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  }, // Message status
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
