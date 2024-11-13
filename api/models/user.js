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
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
