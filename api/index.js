require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mediaRoutes = require("./routes/media");
const chatRoutes = require("./routes/chatRoutes");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = 4000;

// const http = require("http").createServer(app);
// const io = require("socket.io")(http);

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
    console.log("Error connecting to MongoDB");
  });

app.use("/user", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", mediaRoutes);
app.use("/chat", chatRoutes);

// Socket.io setup and handlers (as you've already implemented)
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Handle sending a message
  socket.on("sendMessage", ({ chatId, senderId, text }) => {
    const message = new Message({ chatId, senderId, text });
    message.save().then((savedMessage) => {
      io.to(chatId).emit("receiveMessage", savedMessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// app.use(authenticateToken);

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(port, () => {
  console.log("Server running on 4000");
});
