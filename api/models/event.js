const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    eventDetails: {
      type: String,
      required: true,
    },
    artists: [
      {
        name: String,
        role: String, // e.g., singer, dancer, etc.
      },
    ],
    location: {
      type: String, // Single string for location
    },
    images: [
      {
        url: String,
        // description: String,
      },
    ],
    videoUrl: {
      type: String, // Change to single string for a single video URL
      // description: String,
    },
    ticketPrice: {
      type: Number, // in the local currency
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

//==============================================================//
// npm install react-native-geolocation-service

// import Geolocation from 'react-native-geolocation-service';
// import { Platform, PermissionsAndroid } from 'react-native';

// // Request location permission (necessary on Android)
// async function requestLocationPermission() {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: "Location Permission",
//           message: "This app needs access to your location.",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK"
//         }
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use the location");
//       } else {
//         console.log("Location permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   }
// }

// // Get user location
// function getUserLocation() {
//   Geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       console.log('User Location:', latitude, longitude);
//       // Save these coordinates in your database or use them as needed
//     },
//     (error) => {
//       // See error code charts below.
//       console.log(error.code, error.message);
//     },
//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//   );
// }

// // Usage example
// requestLocationPermission().then(() => {
//   getUserLocation();
// });
