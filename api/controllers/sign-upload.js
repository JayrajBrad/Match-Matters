const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.generateSignature = (req, res, next) => {
  const { folder } = req.body;

  if (!folder) {
    return res.status(400).json({ error: "folder name is required" });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating signature:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
