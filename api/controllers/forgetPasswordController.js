const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/user"); // Adjust the path based on your project structure

// Request Password Reset
exports.requestResetPassword = async (req, res) => {
  const { emailId } = req.body;

  if (!emailId)
    return res.status(400).send({ message: "Email ID is required." });

  try {
    const user = await User.findOne({ emailId });
    if (!user) return res.status(404).send({ message: "User not found." });

    // Generate a token and expiry time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour validity

    user.passwordResetToken = resetToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // const expoResetLink = `  http://localhost:8081/reset-password/${resetToken}`;

    // const expoResetLink = ` exp://192.168.1.38:8081/reset-password/${resetToken}`;
    const resetLink = `${process.env.CLIENT_URL}reset-password/${resetToken}`;
    console.log("reset link :", resetLink);
    // console.log("reset link :", expoResetLink);
    await transporter.sendMail({
      to: emailId,
      subject: "Password Reset Request",
      text: `Click here to reset your password: ${resetLink}`,
      html: `
      <html>
        <body>
          <p>Click the link below to reset your password:</p>
          <a href="matchmatters://reset-password/${resetLink}" style="text-decoration: none; color: #1a73e8;">Reset Password</a>
          <p>If the above link doesn't work, copy and paste the following into your app:</p>
          <p>matchmatters://reset-password/${resetLink}</p>
          <p>Alternatively, open this link in your browser:</p>
          <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">${process.env.CLIENT_URL}/reset-password/${resetToken}</a>
        </body>
      </html>`,
    });

    res.status(200).send({ message: "Reset link sent to your email address." });
  } catch (error) {
    console.error("Error in requestResetPassword:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).send({ message: "Invalid request." });

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).send({ message: "Invalid or expired token." });

    // Hash the new password and save
    user.password = bcrypt.hashSync(newPassword, 10); // Adjust bcrypt rounds as needed
    user.passwordResetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).send({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};
