const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken"); // Import the middleware

// User Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/getAllUsers", authenticateToken, userController.getAllUsers); // Protect this route
router.get("/:userId", userController.getUserData);
router.put("/updateUserProfile", userController.updateUserProfile);

module.exports = router;
