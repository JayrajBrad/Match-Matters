const User = require("../models/user");
const Event = require("../models/event");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

console.log("JWT_SECRET from usercontroller: ", JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET from usercontroller: ", REFRESH_TOKEN_SECRET);

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json({ status: "ok", data: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const {
      userId,
      username,
      phoneNumber,
      gender,
      selectedPreferences,
      images,
      countryName,
      stateName,
      cityName,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          phoneNumber,
          gender,
          selectedPreferences,
          images,
          countryName,
          stateName,
          cityName,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user data as response
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Request body:", req.body); // Get userId from URL params
    const { images } = req.body; // Get imageUrl from the request body

    // if (!imageUrl) {
    //   console.error("Image URL is invalid:", imageUrl);
    //   return res.status(400).json({ error: "Image URL is required" });
    // }

    if (!images || !Array.isArray(images) || images.length === 0) {
      console.error("Image URL is invalid:", images);
      return res.status(400).json({ error: "Image URL(s) is required" });
    }

    // Find the user by ID and update the profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { images } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("UC ->", updatedUser);

    res.status(200).json({
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProfileImage = async (req, res) => {
  const { userId } = req.params;
  const { imageUrl } = req.body; // Image URL to delete from user's profile

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the image to delete
    user.images = user.images.filter((image) => image !== imageUrl);

    // Save the updated user profile
    await user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ message: "Error deleting profile image" });
  }
};

exports.getCreatedEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters
    console.log("Request params:", req.params);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userId).populate("createdEvents"); // Populating createdEvents

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, retrieve the events from createdEvents field
    const createdEvents = user.createdEvents;

    if (!createdEvents || createdEvents.length === 0) {
      return res
        .status(404)
        .json({ message: "No events created by this user" });
    }

    res.status(200).json(createdEvents);
  } catch (error) {
    console.error(
      "Error fetching created events by user ID:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserBookedEvents = async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the authenticated user

  try {
    // Find the user by ID and populate the eventsBooked field
    const user = await User.findById(userId).populate("eventsBooked");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the booked events
    return res.status(200).json(user.eventsBooked);
  } catch (error) {
    console.error("Error retrieving booked events:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllUsersFriends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    res.json(users);
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getUserFriends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "username emailId images"
    );
    res.json(user.friends);
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching friends" });
  }
};
