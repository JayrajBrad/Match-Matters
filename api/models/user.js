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
  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      // message: {
      //   type: String,
      //   required: true,
      // },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
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
    height: {
      type: Number, // In centimeters or inches (you can specify the unit as needed)
      required: false,
    },
    work: {
      type: String, // Job/occupation
      required: false,
    },
    educationLevel: {
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
    languages: [
      {
        type: String, // Languages they know
      },
    ],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
