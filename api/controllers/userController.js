const User = require("../models/user");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Secret key for JWT (keep this secret and store it securely)
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET from usercontroller: ", JWT_SECRET);

// Register User with all fields from the schema
exports.registerUser = async (req, res) => {
  try {
    const {
      phoneNumber,
      emailId,
      password,
      firstName,
      lastName,
      age,
      gender,
      selectedPreferences = [],
      images = [],
      isAdmin = false,
    } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided data and hashed password
    const newUser = new User({
      phoneNumber,
      emailId,
      password: hashedPassword, // Store the hashed password
      firstName,
      lastName,
      age,
      gender,
      selectedPreferences, // Optional field, will default to an empty array
      images, // Optional field, will default to an empty array
      isAdmin, // Default to false unless specified
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token with the user's ID as the payload
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token expiration time
      }
    );

    // Respond with the token and a success message
    res.status(200).json({
      message: "User registered successfully!",
      token, // Send the JWT token in the response
      user: {
        _id: newUser._id,
        emailId: newUser.emailId,
        phoneNumber: newUser.phoneNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        age: newUser.age,
        gender: newUser.gender,
        selectedPreferences: newUser.selectedPreferences,
        images: newUser.images,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    // Log the error and respond with an internal server error message
    console.error("Error creating user:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User with Password Verification and Token Generation
// exports.loginUser = async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ emailId });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

//     // Generate a JWT token with the user's ID as the payload
//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       JWT_SECRET,
//       {
//         expiresIn: "7d", // Token expiration time
//       }
//     );

//     // Respond with the token and user details
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token, // Send the JWT token in the response
//       user: {
//         _id: user._id,
//         emailId: user.emailId,
//         // Include other user details if necessary
//       },
//     });
//   } catch (error) {
//     console.error("Error logging in user:", error.message, error.stack);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// Login User with Password Verification and Token Generation
exports.loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Check if email and password are provided
    if (!emailId || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate a JWT token with the user's ID and isAdmin status
    let token;
    try {
      token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        JWT_SECRET,
        {
          expiresIn: "7d", // Token expiration time
        }
      );
      console.log("token generated at login : ", token);
    } catch (error) {
      console.error("Error generating token:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error generating token" });
    }

    // Respond with the token and user details
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        emailId: user.emailId,
        // Include other user details if necessary
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
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

// Get Latest User
exports.getLatestUser = async (req, res) => {
  try {
    const latestUser = await User.findOne({}).sort({ _id: -1 }).exec();
    res.status(200).json({ status: "ok", data: latestUser });
  } catch (error) {
    console.error("Error fetching latest user:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
