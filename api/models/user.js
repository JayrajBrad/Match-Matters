const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  phoneNumber: {
    type: Number,
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
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  birthdate: {
    type: Date, // Use Date type for storing ISO date strings
    required: true,
  },
  gender: {
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
  // chats: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //     },
  //     lastMessage: {
  //       type: String,
  //     },
  //     timestamp: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
