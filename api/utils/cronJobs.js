// // utils/cronJobs.js

// const cron = require("node-cron");
// const Event = require("../models/event");
// const MostHappening = require("../models/MostHappening");
// const mongoose = require("mongoose");

// /**
//  * Function to update the MostHappening collection
//  */
// const updateMostHappening = async () => {
//   try {
//     console.log(
//       "Starting updateMostHappening job at",
//       new Date().toLocaleString()
//     );

//     // Fetch the top 25 most vibed events
//     const topEvents = await Event.aggregate([
//       { $match: { eventStatus: "active" } },
//       {
//         $addFields: {
//           vibesCount: { $size: { $ifNull: ["$vibes", []] } },
//         },
//       },
//       { $sort: { vibesCount: -1 } },
//       { $limit: 25 },
//       { $project: { eventId: "$_id", vibesCount: 1 } },
//     ]);

//     // Clear the existing MostHappening collection
//     await MostHappening.deleteMany({});
//     console.log("Cleared existing MostHappening collection.");

//     // Insert the new top 25 events
//     await MostHappening.insertMany(topEvents);

//     console.log("MostHappening collection updated successfully.");
//   } catch (error) {
//     console.error("Error updating MostHappening collection:", error);
//   }
// };

// /**
//  * Initialize the cron job to run every 24 hours
//  */
// const initializeCronJobs = () => {
//   // Schedule the job to run at midnight every day
//   //   cron.schedule("0 0 * * *", () => {
//   //     updateMostHappening();
//   //   });

//   cron.schedule("* * * * *", () => {
//     updateMostHappening();
//   });

//   console.log("Cron jobs initialized.");
// };

// // Immediately run the update on server start (optional)
// updateMostHappening();

// module.exports = initializeCronJobs;

// utils/cronJobs.js

const cron = require("node-cron");
const Event = require("../models/event");
const MostHappening = require("../models/MostHappening");
const mongoose = require("mongoose");

/**
 * Function to update the MostHappening collection
 */
const updateMostHappening = async () => {
  try {
    console.log(
      "Starting updateMostHappening job at",
      new Date().toLocaleString()
    );

    // Fetch the top 25 most vibed events
    const topEvents = await Event.aggregate([
      { $match: { eventStatus: "active" } },
      {
        $addFields: {
          vibesCount: { $size: { $ifNull: ["$vibes", []] } },
        },
      },
      { $sort: { vibesCount: -1 } },
      { $limit: 25 },
      {
        $project: {
          _id: 0, // Exclude the original _id to let MongoDB generate a new one
          eventId: "$_id",
          vibesCount: 1,
        },
      },
    ]);

    // Clear the existing MostHappening collection
    await MostHappening.deleteMany({});
    console.log("Cleared existing MostHappening collection.");

    // Insert the new top 25 events
    await MostHappening.insertMany(topEvents);
    console.log("MostHappening collection updated successfully.");
  } catch (error) {
    console.error("Error updating MostHappening collection:", error);
  }
};

/**
 * Initialize the cron job to run every 24 hours
 */
const initializeCronJobs = () => {
  // Schedule the job to run at midnight every day
  cron.schedule("0 0 * * *", () => {
    updateMostHappening();
  });

  console.log("Cron jobs initialized.");
};

// Immediately run the update on server start (optional)
updateMostHappening();

module.exports = initializeCronJobs;
