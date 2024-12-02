const express = require("express");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signed upload params (timestamp, signature)
function generateSignedUploadParams() {
  const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp

  // Parameters to be signed, order matters
  const params = {
    folder: "profile_pictures",
    timestamp: timestamp,
    transformation: "w_800,h_800,c_fill,q_80,f_auto",
    upload_preset: "profilepic_preset",
  };

  // Build the string to sign (all parameters should be in the correct order)
  const stringToSign =
    Object.keys(params)
      .sort() // Sort parameters alphabetically by key
      .map((key) => `${key}=${params[key]}`)
      .join("&") + cloudinary.config().api_secret; // Append the api_secret to the end

  // Generate the signature by hashing the string to sign with SHA1
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");
  console.log("signature generated :", signature);
  return { signature, timestamp };
}

// Endpoint to get signed upload parameters
app.get("/cloudinary-signature", (req, res) => {
  const { signature, timestamp } = generateSignedUploadParams();
  res.json({ signature, timestamp });
});

module.exports = app;
