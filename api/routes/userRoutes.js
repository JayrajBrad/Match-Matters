const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController.js");
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

// User Routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
// router.post("/refresh-token", userController.refreshToken);
router.get("/getAllUsers", authenticateToken, userController.getAllUsers); // Protect this route
router.get("/:userId", userController.getUserData);
router.put("/updateUserProfile", userController.updateUserProfile);
router.put("/:userId/update-profile-image", userController.updateProfileImage);
router.delete(
  "/:userId/delete-profile-image",
  userController.deleteProfileImage
);
router.get("/:userId/events", userController.getCreatedEventsByUserId);
router.get("/users/:userId/events", userController.getUserBookedEvents);
router.get("/users/:userId", userController.getAllUsersFriends);
router.get("/user/:userId", userController.getUserFriends);

module.exports = router;
