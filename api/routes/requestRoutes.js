const express = require("express");
const {
  sendRequest,
  getRequests,
  acceptRequest,
} = require("../controllers/requestController");

const router = express.Router();

router.post("/sendrequest", sendRequest);
router.get("/getrequests/:userId", getRequests);
router.post("/acceptrequest", acceptRequest);

module.exports = router;
