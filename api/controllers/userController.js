const User = require("../models/user");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

console.log("JWT_SECRET from usercontroller: ", JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET from usercontroller: ", REFRESH_TOKEN_SECRET);

exports.registerUser = async (req, res) => {
  try {
    const {
      username,
      phoneNumber,
      emailId,
      password,
      // firstName,
      // lastName,
      age,
      birthdate,
      cityName,
      stateName,
      countryName,
      gender,
      selectedPreferences = [],
      images = [],
      isAdmin = false,
    } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // const existingUsername = await User.findOne({ username });
    // if (existingUsername) {
    //   return res.status(400).json({ error: "Username already taken" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided data and hashed password
    const newUser = new User({
      username,
      phoneNumber,
      emailId,
      password: hashedPassword,
      // firstName,
      // lastName,
      age,
      birthdate,
      cityName,
      stateName,
      countryName,
      gender,
      selectedPreferences,
      images,
      isAdmin,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token expiration time
      }
    );

    res.status(200).json({
      message: "User registered successfully!",
      token, // Send the JWT token in the response
      user: {
        _id: newUser._id,
        username: newUser.username,
        emailId: newUser.emailId,
        phoneNumber: newUser.phoneNumber,
        // firstName: newUser.firstName,
        // lastName: newUser.lastName,
        age: newUser.age,
        birthdate: newUser.birthdate,
        location: {
          cityName: newUser.cityName,
          stateName: newUser.stateName,
          countryName: newUser.countryName,
        },
        gender: newUser.gender,
        selectedPreferences: newUser.selectedPreferences,
        images: newUser.images,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.loginUser = async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!emailId || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email and password are required" });
//     }

//     const user = await User.findOne({ emailId });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

//     let token;
//     try {
//       token = jwt.sign(
//         { userId: user._id, isAdmin: user.isAdmin },
//         JWT_SECRET,
//         {
//           expiresIn: "7d",
//         }
//       );
//       console.log("token generated at login : ", token);
//     } catch (error) {
//       console.error("Error generating token:", error.message);
//       return res
//         .status(500)
//         .json({ success: false, message: "Error generating token" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       refreshToken,
//       user: {
//         _id: user._id,
//         emailId: user.emailId,
//         phoneNumber: user.phoneNumber,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         age: user.age,
//         birthdate: user.birthdate,
//         gender: user.gender,
//         selectedPreferences: user.selectedPreferences,
//         images: user.images,
//         isAdmin: user.isAdmin,
//       },
//     });
//   } catch (error) {
//     console.error("Error logging in user:", error.message, error.stack);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    let token, refreshToken;
    try {
      token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        JWT_SECRET,
        {
          expiresIn: "7d", // Shorter expiration for access token
        }
      );

      refreshToken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "30d", // Longer expiration for refresh token
        }
      );

      console.log("Access token generated:", token);
      console.log("Refresh token generated:", refreshToken);
    } catch (error) {
      console.error("Error generating tokens:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error generating tokens" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Access token
      refreshToken, // Refresh token
      user: {
        _id: user._id,
        username: user.username,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        // firstName: user.firstName,
        // lastName: user.lastName,
        age: user.age,
        birthdate: user.birthdate,
        gender: user.gender,
        selectedPreferences: user.selectedPreferences,
        images: user.images,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("refreshToken controller :", token);

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
      // Use a separate secret for refresh tokens
      if (err)
        return res.status(403).json({ message: "Invalid  refresh token" });
      const newAccessToken = jwt.sign(
        { userId: user.userId, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({ token: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Users
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
      // firstName,
      // lastName,
      username,
      phoneNumber,
      gender,
      selectedPreferences,
    } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { username, phoneNumber, gender, selectedPreferences },
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
