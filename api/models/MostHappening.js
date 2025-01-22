// models/mostHappening.js

const mongoose = require("mongoose");

const mostHappeningSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    vibesCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // To track when the entry was added
  }
);

// Optionally, index `vibesCount` for faster queries
mostHappeningSchema.index({ vibesCount: -1 });

const MostHappening = mongoose.model("MostHappening", mostHappeningSchema);

module.exports = MostHappening;
