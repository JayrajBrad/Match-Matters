// const Message = require("../models/conversation");
const Conversation = require("../models/conversation");

const User = require('../models/user'); // Import your User model
const fetch = require('node-fetch'); // Ensure you have `node-fetch` installed for notifications


  exports.registerPushToken = async (req, res) => {
    const { userId, pushToken } = req.body;
    console.log("Received push token:", pushToken, "User Id",userId); // Log the received push token

    if (!userId || !pushToken) {
      return res.status(400).json({ error: "User ID and push token are required" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { pushToken },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Push token registered successfully" });
    } catch (error) {
      console.error("Error registering push token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  exports.removePushToken = async (req, res) => {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: "Push token is required" });
    }

    try {
      const user = await User.findOneAndUpdate(
        { pushToken },
        { $unset: { pushToken: "" } }, // Remove the push token
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Push token removed successfully" });
    } catch (error) {
      console.error("Error removing push token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

   async function sendPushNotification(pushToken, message)  {
    const payload = {
      to: pushToken,
      sound: "default",
      title: "New Message",
      body: message,
    };

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Push notification response:", await response.json());
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };









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
   // Find the receiver's push token
   const receiver = await User.findById(receiverId);
   if (!receiver) {
     return res.status(404).json({ error: "Receiver not found" });
   }


    // Send push notification if receiver is offline
    if (!userSocketMap[receiverId] && receiver.pushToken) {
      await sendPushNotification(receiver.pushToken, message);
    }

    let conversation = await Conversation.findOne({
      users: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        users: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = {
      senderId,
      receiverId,
      message,
      timeStamp: new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.lastUpdated = Date.now();
    await conversation.save();

    // const newMessage = new Message({ senderId, receiverId, message });
    // await newMessage.save();

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

    // Find the conversation
    const conversation = await Conversation.findOne({
      users: { $all: [senderId, receiverId] },
    }).populate("messages.senderId messages.receiverId");

    if (!conversation) {
      // No conversation exists, return an empty array
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: conversation.messages });
    // const messages = await Message.find({
    //   $or: [
    //     { senderId: senderId, receiverId: receiverId },
    //     { senderId: receiverId, receiverId: senderId },
    //   ],
    // }).populate("senderId", "_id username");

    // res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

exports.getLatestMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const conversation = await Conversation.findOne({
      users: { $all: [senderId, receiverId] },
    }).sort({ "messages.timeStamp": -1 });

    if (!conversation || conversation.messages.length === 0) {
      return res.status(200).json({ message: "No messages yet" });
    }

    // Get the latest message
    const latestMessage =
      conversation.messages[conversation.messages.length - 1];

    res.status(200).json(latestMessage);

    // const latestMessage = await Message.findOne({
    //   $or: [
    //     { senderId: senderId, receiverId: receiverId },
    //     { senderId: receiverId, receiverId: senderId },
    //   ],
    // })
    //   .sort({ timeStamp: -1 }) // Sort by timestamp in descending order
    //   .limit(1);
    // res.status(200).json(latestMessage || { message: "No messages yet" });
  } catch (error) {
    console.log("Error fetching latest message:", error);
    res.status(500).json({ error: "Error fetching latest message" });
  }
};
