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
      type: String, // Single string for location
    },
    // location: {
    //   type: {
    //     type: String, // Must be 'Point'
    //     enum: ["Point"], // 'location.type' must be 'Point'
    //     required: true,
    //   },
    //   coordinates: {
    //     type: [Number], // Array of numbers: [longitude, latitude]
    //     required: true,
    //   },
    //   address: {
    //     type: String,
    //     required: true,
    //   },
    // },
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
