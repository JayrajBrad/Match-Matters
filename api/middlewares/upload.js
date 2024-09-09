// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-app", // Folder where images/videos will be stored in Cloudinary
    allowed_formats: [
      "jpg",
      "png",
      "mp4",
      "jpeg",
      "mov",
      "bmp",
      "tiff",
      "webp",
      "avi",
      "hevc",
    ], // Specify allowed formats
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
