const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    console.log(
      "Sender ID:",
      senderId,
      "Receiver ID:",
      receiverId,
      "Message:",
      message
    );

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    // Retrieve socket IDs
    console.log("Current userSocketMap:", global.userSocketMap);
    const receiverSocketId = global.userSocketMap[receiverId];
    const senderSocketId = global.userSocketMap[senderId];
    console.log(receiverSocketId, senderSocketId);

    // Emit message to the receiver if they're connected
    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("receiveMessage", newMessage);
      console.log("Message sent to receiver:", receiverSocketId);
    } else {
      console.log("Receiver not connected:", receiverId);
    }

    // Emit to both sender and receiver for latest message, if connected
    const connectedSockets = [receiverSocketId, senderSocketId].filter(Boolean); // Filters out undefined values
    if (connectedSockets.length > 0) {
      global.io.to(connectedSockets).emit("latestMessage", {
        userId: senderId,
        latestMessage: newMessage,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).json({ error: "Message not sent" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id username");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

exports.getLatestMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const latestMessage = await Message.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ timeStamp: -1 }) // Sort by timestamp in descending order
      .limit(1);
    res.status(200).json(latestMessage || { message: "No messages yet" });
  } catch (error) {
    console.log("Error fetching latest message:", error);
    res.status(500).json({ error: "Error fetching latest message" });
  }
};
