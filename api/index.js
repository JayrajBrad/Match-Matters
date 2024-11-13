require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const requestRoutes = require("./routes/requestRoutes");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
const port = 4000;

// Initialize HTTP and Socket.io servers
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*", // Ensure CORS allows all origins; adjust if needed
  },
});

// Set global io after initialization
global.io = io;

// Import routes after defining io
const messageRoutes = require("./routes/messageRoutes")(io);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://atharv:AtharvBrad@cluster0.lmx3gz5.mongodb.net/match_matters"
  )
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.use("/user", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", requestRoutes);
app.use("/api", messageRoutes);

// Socket.io setup and handlers
global.userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId, "Socket ID:", socket.id);

  if (userId && userId !== "undefined") {
    global.userSocketMap[userId] = socket.id;
    console.log("User socket map updated:", global.userSocketMap);
  } else {
    console.log("No valid userId received during connection");
  }

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = global.userSocketMap[receiverId];
    console.log(
      "Received message:",
      message,
      "from",
      senderId,
      "to",
      receiverId
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        receiverId,
        message,
      });
      console.log("Message sent to receiver:", receiverSocketId);
    } else {
      console.log("Receiver not connected");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId && global.userSocketMap[userId]) {
      delete global.userSocketMap[userId]; // Ensure userId exists before deleting
      console.log(`User ${userId} removed from socket map`);
    }
  });
});

http.listen(6000, () => {
  console.log("Socket server running on port 6000");
});

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(port, () => {
  console.log("Server running on port 4000");
});
