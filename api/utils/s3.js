// routes/s3.js
const express = require("express");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/s3-presigned-url", async (req, res) => {
  try {
    const { folder, fileType, fileName } = req.body;

    const key = `${folder}/${uuidv4()}-${fileName}`;
    console.log("Generated S3 Key:", key);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 86400,
    });

    return res.status(200).json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating S3 pre-signed URL:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate S3 pre-signed URL" });
  }
});

router.get("/s3-presigned-url", async (req, res) => {
  try {
    let { key } = req.query;
    key = decodeURIComponent(key);
    console.log("Decoded key:", key);

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      // Disable checksum mode to avoid extra parameters causing signature mismatches
      ChecksumMode: "Disabled",
    });

    const preSignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 86400,
    });
    // console.log("Pre-signed URL:", preSignedUrl);

    return res.status(200).json({ preSignedUrl });
  } catch (error) {
    console.error("Error generating GET pre-signed URL:", error);
    return res
      .status(500)
      .json({ error: "Could not generate GET pre-signed URL" });
  }
});

module.exports = router;
