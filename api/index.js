require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cronJobs = require("./utils/cronJobs");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const requestRoutes = require("./routes/requestRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const forgetPasswordRoutes = require("./routes/forgetPasswordRoutes");
const authenticateToken = require("./middlewares/authenticateToken");
const cloudinaryApp = require("./utils/cloudinary");
const s3Routes = require("./utils/s3");
const Payment = require("./models/Payment");
const User = require("./models/user");
const Event = require("./models/event");
const axios = require("axios");
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
app.use("/api", ticketRoutes);

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

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
const CASHFREE_ENVIRONMENT = process.env.CASHFREE_ENVIRONMENT; // e.g., "https://sandbox.cashfree.com/pg"

const generateShortLinkId = () => {
  return Math.random().toString(36).substring(2, 12); // ~10 characters
};

app.post("/create-payment", async (req, res) => {
  const { name, email, phone, amount, eventId, userId } = req.body;
  console.log(req.body);
  const phoneString = phone ? phone.toString() : "";
  const shortId = generateShortLinkId();
  const linkId = `cf_${shortId}`;

  const paymentData = {
    customer_details: {
      customer_email: email,
      customer_name: name,
      customer_phone: phoneString,
    },
    link_amount: amount,
    link_currency: "INR",
    link_expiry_time: "2025-12-31T23:59:59+05:30",
    link_id: linkId,
    link_purpose: "Payment Link",
    link_partial_payments: false,
    link_notify: { send_sms: true, send_email: true },
    // You can also embed eventId and userId in link_meta or link_notes if desired:
    link_notes: {
      event_id: eventId,
      user_id: userId,
    },
    link_meta: {
      notify_url: process.env.WEBHOOK_URL,
    },
  };

  try {
    const response = await axios.post(
      `${CASHFREE_ENVIRONMENT}/links`,
      paymentData,
      {
        headers: {
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_CLIENT_SECRET,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    // Store the Payment record in Mongo BEFORE sending response back
    const newPayment = new Payment({
      link_id: linkId,
      // user_id: userId,
      // event_id: eventId,
      userId, // not user_id
      eventId,
      user_email: email,
      user_name: name,
      phone: phoneString,
      amount: amount,
      status: "PENDING", // you can mark it as 'PENDING' initially
      payment_time: null, // will be set on successful webhook
    });
    await newPayment.save();

    // Return the link data
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error generating payment link:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate payment link" });
  }
});

// app.post("/webhook", async (req, res) => {
//   console.log("Webhook received:", req.body);
//   const { link_id, customer_details, link_amount, link_status } = req.body;

//   try {
//     // Find the Payment by link_id
//     const payment = await Payment.findOne({ link_id });

//     if (!payment) {
//       return res.status(404).send("Payment record not found");
//     }

//     // Update the Payment record
//     payment.user_email = customer_details.customer_email;
//     payment.user_name = customer_details.customer_name;
//     payment.phone = customer_details.customer_phone;
//     payment.amount = link_amount;
//     payment.status = link_status; // e.g., "PAID", "EXPIRED", etc.
//     payment.payment_time = new Date();

//     await payment.save();
//     res.status(200).send("Webhook received");
//   } catch (error) {
//     console.error("Error saving webhook data:", error);
//     res.status(500).send("Error processing webhook");
//   }
// });

// --- Endpoint to Check Payment Status ---

app.post("/webhook", async (req, res) => {
  const { link_id, customer_details, link_amount, link_status } = req.body;
  console.log("Webhook received:", req.body);
  try {
    // 1) Find the Payment by link_id
    const payment = await Payment.findOne({ link_id });
    if (!payment) {
      return res.status(404).send("Payment record not found");
    }

    // 2) Update the Payment record fields
    payment.user_email = customer_details.customer_email;
    payment.user_name = customer_details.customer_name;
    payment.phone = customer_details.customer_phone;
    payment.amount = link_amount;
    payment.status = link_status; // e.g., "PAID", "EXPIRED", etc.
    payment.payment_time = new Date(); // Payment just happened

    await payment.save();

    // 3) If the payment is PAID, then register the user for the event
    if (link_status === "PAID") {
      // Grab the userId and eventId from the Payment record
      const { userId, eventId } = payment;
      console.log("Webhook body:", req.body);
      console.log("Payment found:", payment);
      console.log("link_status:", link_status);
      console.log(
        "Payment userId:",
        payment.userId,
        " Payment eventId:",
        payment.eventId
      );

      // --- Add the user to the event ---
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error saving webhook data:", error);
    res.status(500).send("Error processing webhook");
  }
});

app.get("/check-payment/:linkId", async (req, res) => {
  const { linkId } = req.params;
  try {
    const response = await axios.get(
      `${CASHFREE_ENVIRONMENT}/links/${linkId}`,
      {
        headers: {
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_CLIENT_SECRET,
          "x-api-version": "2023-08-01",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error checking payment status:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error checking payment status" });
  }
});

// In your main server.js (or a dedicated file like paymentRoutes.js)
app.get("/check-and-update-payment/:linkId", async (req, res) => {
  const { linkId } = req.params;
  try {
    // 1) Call Cashfree to get the latest link info
    const response = await axios.get(
      `${CASHFREE_ENVIRONMENT}/links/${linkId}`,
      {
        headers: {
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_CLIENT_SECRET,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const { link_status } = response.data; // e.g. "PAID", "ACTIVE", "EXPIRED", etc.

    // 2) Find the Payment in MongoDB
    const payment = await Payment.findOne({ link_id: linkId });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // 3) Update the Payment's status in your DB
    payment.status = link_status;
    if (link_status === "PAID" && !payment.payment_time) {
      payment.payment_time = new Date(); // set the payment time if not already set
    }
    await payment.save();

    // 4) Return updated status to the client
    return res.json({
      link_status,
      message: `Payment status updated to ${link_status}`,
    });
  } catch (error) {
    console.error(
      "Error checking + updating payment status:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error checking/updating payment status" });
  }
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
