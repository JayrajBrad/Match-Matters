const express = require("express");
const {
  requestResetPassword,
  resetPassword,
} = require("../controllers/forgetPasswordController");

const router = express.Router();

// Route to request password reset
router.post("/request-reset-password", requestResetPassword);

// Route to reset password
router.post("/reset-password", resetPassword);

module.exports = router;
