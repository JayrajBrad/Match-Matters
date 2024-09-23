// chatController.js

const Chat = require("../models/Chat"); // Assuming you have a Chat model in the models directory
const Message = require("../models/Message "); // Assuming you have a Message model in the models directory

// Handle initiating a chat
const createChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  // Sort user IDs to maintain a consistent chatId order
  const participants = [userId1, userId2].sort();

  try {
    // Check if a chat between these users already exists
    let chat = await Chat.findOne({ participants });

    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({ participants });
      await chat.save();
    }
    console.log("Chat created or found:", chat);
    res.status(200).json({ chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create or find chat" });
  }
};

// Fetch messages by chatId
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = {
  createChat,
  getMessages,
};
