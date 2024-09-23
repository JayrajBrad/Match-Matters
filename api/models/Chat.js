const mongoose = require("mongoose"); // Make sure mongoose is imported

const ChatSchema = new mongoose.Schema({
  participants: [String], // Array of user IDs involved in the chat (typically 2 IDs for one-on-one chats)
  lastMessage: String, // To store the text of the last message (for preview purposes)
  lastMessageTime: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat; // Export the model if you need to use it elsewhere
