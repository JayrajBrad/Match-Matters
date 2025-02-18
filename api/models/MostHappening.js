// // // models/mostHappening.js

// // const mongoose = require("mongoose");

// // const mostHappeningSchema = new mongoose.Schema(
// //   {
// //     eventId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Event",
// //       required: true,
// //       unique: true,
// //     },
// //     vibesCount: {
// //       type: Number,
// //       required: true,
// //     },
// //   },
// //   {
// //     timestamps: true, // To track when the entry was added
// //   }
// // );

// // // Optionally, index `vibesCount` for faster queries
// // // mostHappeningSchema.index({ vibesCount: -1 });

// // const MostHappening = mongoose.model("MostHappening", mostHappeningSchema);

// // module.exports = MostHappening;


// // models/mostHappening.js

// const mongoose = require("mongoose");

// const mostHappeningSchema = new mongoose.Schema(
//   {
//     eventId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Event",
//       required: true,
//       unique: true,
//       validate: {
//         validator: async function (value) {
//           const Event = require("./event");
//           const eventExists = await Event.exists({ _id: value });
//           return eventExists;
//         },
//         message: "Referenced Event does not exist",
//       },
//     },
//     vibesCount: {
//       type: Number,
//       required: true,
//       min: [0, "vibesCount cannot be negative"],
//     },
//   },
//   {
//     timestamps: true, // To track when the entry was added
//   }
// );

// // Index for faster queries
// mostHappeningSchema.index({ vibesCount: -1 });

// const MostHappening = mongoose.model("MostHappening", mostHappeningSchema);

// module.exports = MostHappening;
const mongoose = require("mongoose");

const mostHappeningSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
      validate: {
        validator: async function (value) {
          const Event = require("./event");
          return await Event.exists({ _id: value });
        },
        message: "Referenced Event does not exist",
      },
    },
    vibesCount: {
      type: Number,
      required: true,
      min: [0, "vibesCount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
mostHappeningSchema.index({ vibesCount: -1 });

const MostHappening = mongoose.model("MostHappening", mostHappeningSchema);

module.exports = MostHappening;