// // controllers/mediaController.js
// const cloudinary = require("cloudinary").v2; // Make sure cloudinary is set up properly
// const upload = require("../middlewares/upload");

// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadMedia = (req, res) => {
//   upload.single("media")(req, res, (err) => {
//     if (err) {
//       console.error("Error uploading media:", err.message);
//       return res.status(500).json({ error: "Failed to upload media" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("Uploaded file info:", req.file);

//     const file = req.file;
//     const fileUrl = req.file.path;

//     if (file.mimetype.startsWith("video/")) {
//       // Handle video uploads
//       return res.status(200).json({
//         message: "Video uploaded successfully",
//         url: fileUrl,
//       });
//     } else if (file.mimetype.startsWith("image/")) {
//       // Handle image uploads
//       return res.status(200).json({
//         message: "Image uploaded successfully",
//         url: fileUrl,
//       });
//     } else {
//       return res.status(400).json({ error: "Unsupported file type" });
//     }
//   });
// };

// // Function to upload an image
// const uploadImageToCloudinary = async (imagePath) => {
//   try {
//     const result = await cloudinary.v2.uploader.upload(imagePath, {
//       folder: "profile_pictures", // Optional: specify the folder in Cloudinary
//     });
//     console.log("Cloudinary URL:", result.secure_url);
//     return result.secure_url; // Return the URL of the uploaded image
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);
//     throw error; // Throw error to be handled by calling function
//   }
// };

// module.exports = {
//   uploadMedia,
//   uploadImageToCloudinary,
// };
