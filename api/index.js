require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cronJobs = require("./utils/cronJobs");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const requestRoutes = require("./routes/requestRoutes");
const forgetPasswordRoutes = require("./routes/forgetPasswordRoutes");
const authenticateToken = require("./middlewares/authenticateToken");
const cloudinaryApp = require("./utils/cloudinary");
const s3Routes = require("./utils/s3");

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

    cronJobs();
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.use("/api", cloudinaryApp);
app.use("/api", s3Routes);

app.use("/user", userRoutes);
app.use("/user", forgetPasswordRoutes);
app.use("/api", eventRoutes);
app.use("/api", requestRoutes);
app.use("/api", messageRoutes);

// Socket.io setup and handlers
global.userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId, "Socket ID:", socket.id);

  if (userId && userId !== "undefined") {
    if (!global.userSocketMap[userId]) {
      global.userSocketMap[userId] = [];
    }
    global.userSocketMap[userId].push(socket.id);
    console.log("Updated userSocketMap:", global.userSocketMap);
  } else {
    console.log("No valid userId received during connection");
  }

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketIds = global.userSocketMap[receiverId] || [];
    console.log("Current userSocketMap:", global.userSocketMap);

    console.log(
      "Received message:",
      message,
      "from",
      senderId,
      "to",
      receiverId
    );

    if (receiverSocketIds && receiverSocketIds.length > 0) {
      receiverSocketIds.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId,
          receiverId,
          message,
        });
      });
      console.log("Message sent to receiver(s):", receiverSocketIds);
    } else {
      console.log("Receiver not connected :", receiverId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId && global.userSocketMap[userId]) {
      // Remove the socket ID from the userSocketMap
      global.userSocketMap[userId] = global.userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      // If the user has no active sockets, remove them from the map
      if (global.userSocketMap[userId].length === 0) {
        delete global.userSocketMap[userId];
        console.log(`User ${userId} removed from socket map`);
      } else {
        console.log(`User ${userId} still has active sockets`);
      }
    }
  });
});

// http.listen(6000, () => {
//   console.log("Socket server running on port 6000");
// });

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

// app.listen(port, () => {
//   console.log("Server running on port 4000");
// });

http.listen(port, () => {
  console.log(`Server (HTTP + WebSocket) running on port ${port}`);
});
