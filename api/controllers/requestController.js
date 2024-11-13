const User = require("../models/user");

exports.sendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({ error: "Receiver not found" });
  }
  receiver.requests.push({ from: senderId });
  await receiver.save();

  res.status(200).json({ message: "Request sent successfully" });
};

exports.getRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      "requests.from",
      "username emailId images"
    );

    if (user) {
      res.json(user.requests);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log("Error fetching requests:", error);
    res.status(500).json({ error: "Error fetching requests" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { requests: { from: requestId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { friends: requestId },
    });

    await User.findByIdAndUpdate(requestId, {
      $push: { friends: userId },
    });

    res
      .status(200)
      .json({ message: "Request accepted successfully", requestId });
  } catch (error) {
    console.log("Error accepting request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
