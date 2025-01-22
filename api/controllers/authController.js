const User = require("../models/user");
const Event = require("../models/event");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET from usercontroller: ", JWT_SECRET);
// console.log("REFRESH_TOKEN_SECRET from usercontroller: ", REFRESH_TOKEN_SECRET);

exports.registerUser = async (req, res) => {
  try {
    const {
      username,
      phoneNumber,
      countryCode,
      emailId,
      password,

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      phoneNumber,
      countryCode,
      emailId,
      password: hashedPassword,
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
        expiresIn: "1d", // Token expires in 1 hour
      }
    );

    res.status(200).json({
      message: "User registered successfully!",
      token, // Send only the JWT access token
      user: {
        _id: newUser._id,
        username: newUser.username,
        emailId: newUser.emailId,
        phoneNumber: newUser.phoneNumber,
        countryCode: newUser.countryCode,
        age: newUser.age,
        birthdate: newUser.birthdate,

        cityName: newUser.cityName,
        stateName: newUser.stateName,
        countryName: newUser.countryName,

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

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "1d", // Token expires in 1 hour
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Access token
      user: {
        _id: user._id,
        username: user.username,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        countryCode: user.countryCode,

        age: user.age,
        birthdate: user.birthdate,

        cityName: user.cityName,
        stateName: user.stateName,
        countryName: user.countryName,
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
