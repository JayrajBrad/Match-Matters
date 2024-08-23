const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("./models/user");

const app = express();
const port = 4000;

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://sourabh:sourabh@cluster0.2b9bkhi.mongodb.net/mr_button"
  )
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("Server running on 4000");
});

app.post("/register", async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);

    await newUser.save();
    // res.send("data entered");

    const secretKey = crypto.randomBytes(32).toString("hex");

    const token = jwt.sign({ userId: newUser._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error Creating User", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

app.get("/getLatestUser", async (req, res) => {
  try {
    const latestUser = await User.findOne({}).sort({ _id: -1 }).exec();
    res.send({ status: "ok", data: latestUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});
