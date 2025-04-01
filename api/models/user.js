const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    // type : String,
    required: true,
  },
  countryCode: {
    type: String,
    required: false,
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  selectedPreferences: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  requests: {
    type: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    default: [], // Ensures a new user starts with an empty array
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  receivedLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  eventsBooked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ], // New "about you" section
  aboutYou: {
    lookingFor: {
      type: String,
      required: false,
    },
    jobIndustry: {
      type: String, // e.g., Tech, Healthcare, Education
      required: false,
    },
    educationLevel: {
      type: String,

      required: false,
    },
    relationshipStatus: {
      type: String,
      required: false,
    },

    smokes: {
      type: String, // True if smokes, false otherwise
      required: false,
    },
    drinks: {
      type: String, // True if drinks, false otherwise
      required: false,
    },
    zodiac: {
      type: String, // Zodiac sign
      required: false,
    },
    religion: {
      type: String, // Religion
      required: false,
    },

    exerciseFrequency: {
      type: String,
      required: false,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  pushToken: {
    type: String,
    default: null, // Ensures the field exists even if no value is set
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
