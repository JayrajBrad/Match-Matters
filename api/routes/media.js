// routes/event.js
const express = require("express");
const router = express.Router();
const { uploadMedia } = require("../controllers/mediaController");

router.post("/upload-media", uploadMedia);

module.exports = router;
