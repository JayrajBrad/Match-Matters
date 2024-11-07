const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    eventDetails: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true, // Set to true if you want this field to be required
    },
    artists: [
      {
        name: String,
        role: String, // e.g., singer, dancer, etc.
      },
    ],
    location: {
      baseAddress: {
        type: String, // Street address, house/building number
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere", // Geospatial index for querying nearby events
        required: true,
      },
    },
    images: [
      {
        url: String,
      },
    ],
    videoUrl: {
      type: String, // URL for the promotional video
    },
    ticketPrice: {
      type: Number, // in the local currency
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Interaction fields
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Users who liked the event/video

    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Users who shared the video

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    views: {
      type: Number,
      default: 0,
    }, // Count of how many users have viewed the video/event
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
