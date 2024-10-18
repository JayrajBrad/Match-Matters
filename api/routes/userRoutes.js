const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

// User Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/refresh-token", userController.refreshToken);
router.get("/getAllUsers", authenticateToken, userController.getAllUsers); // Protect this route
router.get("/:userId", userController.getUserData);
router.put("/updateUserProfile", userController.updateUserProfile);
router.put("/:userId/update-profile-image", userController.updateProfileImage);
router.delete(
  "/:userId/delete-profile-image",
  userController.deleteProfileImage
);
router.get("/:userId/events", userController.getCreatedEventsByUserId);

module.exports = router;
