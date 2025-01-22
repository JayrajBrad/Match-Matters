const Event = require("../models/event");
const mongoose = require("mongoose");
const User = require("../models/user");
const cloudinary = require("../utils/cloudinary"); // Import your Cloudinary configuration
const parser = require("../middlewares/upload");
const moment = require("moment");

const getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Parse page/limit safely
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Use .lean() for lower memory footprint & faster response
    const [events, totalCount] = await Promise.all([
      Event.find({ userId })
        .lean()
        .skip(skip)
        .limit(parsedLimit)
        // .select("title date location") // If you only need certain fields
        .sort({ date: 1 }), // example: sort by date ascending
      Event.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEventById = async (req, res) => {
  const eventId = req.params.eventId;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event ID" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getEventsByLocation = async (req, res) => {
  try {
    const { city, state, country } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = {};
    if (city) query["location.city"] = city;
    if (state) query["location.state"] = state;
    if (country) query["location.country"] = country;

    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Do parallel queries for speed
    const [events, totalCount] = await Promise.all([
      Event.find(query).lean().skip(skip).limit(parsedLimit),
      Event.countDocuments(query),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events." });
  }
};

const getNearbyEvents = async (req, res) => {
  try {
    const { city, state, country, latitude, longitude, maxDistance } =
      req.params;

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);
    let parsedMaxDist = parseInt(maxDistance, 10) || 300000; // meters

    // Convert meters to radians for $centerSphere
    const distanceInRadians = parsedMaxDist / 6378137; // Earth radius in meters

    // Construct the query for $geoWithin (no sorting)
    const query = {
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [[parsedLng, parsedLat], distanceInRadians],
        },
      },
      // You might still filter by city/state/country if you want:
      "location.city": city,
      "location.state": state,
      "location.country": country,
    };

    // Now we can do a normal .find() plus a .countDocuments() in parallel
    const [events, totalCount] = await Promise.all([
      Event.find(query).lean().skip(skip).limit(parsedLimit),
      Event.countDocuments(query),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error in getNearbyEvents controller:", error);
    res.status(500).json({ error: "Failed to fetch nearby events" });
  }
};

const getCombinedEvents = async (req, res) => {
  try {
    // Extract query parameters
    // Example: /api/events/combined?city=Delhi&state=Delhi&country=India&latitude=28.7041&longitude=77.1025&maxDistance=300000&page=1&limit=10
    const {
      city,
      state,
      country,
      latitude,
      longitude,
      maxDistance = 300000, // in meters
      page = 1,
      limit = 10,
    } = req.query;

    console.log("Reached getCombinedEvents route");
    console.log("Incoming query:", req.query);

    // Convert to proper data types
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    let combinedEvents = [];

    // 1) Query #1: user-location events
    // Only if city/state/country exist
    const locationQuery = {};
    if (city) locationQuery["location.city"] = city;
    if (state) locationQuery["location.state"] = state;
    if (country) locationQuery["location.country"] = country;

    let locationEvents = [];
    if (Object.keys(locationQuery).length > 0) {
      // Just fetch them all for now (we’ll merge and do final skip/limit after)
      locationEvents = await Event.find(locationQuery).lean();
    }

    // 2) Query #2: nearby events
    let nearbyEvents = [];
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const dist = parseInt(maxDistance, 10);

      // Convert meters to radians for $centerSphere
      const distanceInRadians = dist / 6378137; // Earth radius in meters

      const nearbyQuery = {
        "location.coordinates": {
          $geoWithin: {
            $centerSphere: [[lng, lat], distanceInRadians],
          },
        },
      };

      // If city/state/country also need to match, you can combine them:
      if (city) nearbyQuery["location.city"] = city;
      if (state) nearbyQuery["location.state"] = state;
      if (country) nearbyQuery["location.country"] = country;

      nearbyEvents = await Event.find(nearbyQuery).lean();
    }

    // 3) Merge the two arrays and remove duplicates (by _id)
    const mergedArray = [...locationEvents, ...nearbyEvents];

    // Convert to a Map keyed by _id for uniqueness
    const uniqueMap = new Map();
    mergedArray.forEach((eventObj) => {
      uniqueMap.set(String(eventObj._id), eventObj);
    });

    // Convert Map back to array
    combinedEvents = Array.from(uniqueMap.values());

    // 4) (Optional) Sort combined events if needed (e.g., by date ascending)
    combinedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5) Apply final pagination on the merged array
    const totalCount = combinedEvents.length;
    const pagedEvents = combinedEvents.slice(skip, skip + parsedLimit);

    // 6) Return paginated results
    return res.status(200).json({
      events: pagedEvents,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error in getCombinedEvents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getCombinedEvents = async (req, res) => {
//   try {
//     // 1) Extract query parameters
//     const {
//       city,
//       state,
//       country,
//       latitude,
//       longitude,
//       maxDistance = 300000, // meters
//       page = 1,
//       limit = 10,
//     } = req.query;

//     console.log("Reached getCombinedEvents route");
//     console.log("Incoming query:", req.query);

//     // 2) Convert page/limit to integers & compute skip
//     const parsedPage = Math.max(parseInt(page, 10), 1);
//     const parsedLimit = Math.max(parseInt(limit, 10), 1);
//     const skip = (parsedPage - 1) * parsedLimit;

//     // 3) Build an array of possible filters to combine with $or
//     //    a) location-based filter by city/state/country
//     //    b) geospatial filter for nearby
//     const orFilters = [];

//     // a) City/State/Country filter (if provided)
//     const locationFilter = {};
//     if (city) locationFilter["location.city"] = city;
//     if (state) locationFilter["location.state"] = state;
//     if (country) locationFilter["location.country"] = country;

//     // If user sent at least one location field, add to orFilters
//     if (Object.keys(locationFilter).length > 0) {
//       orFilters.push(locationFilter);
//     }

//     // b) Geospatial filter (if latitude & longitude provided)
//     if (latitude && longitude) {
//       const lat = parseFloat(latitude);
//       const lng = parseFloat(longitude);
//       const dist = parseInt(maxDistance, 10);

//       // Convert distance in meters to radians for $centerSphere
//       const distanceInRadians = dist / 6378137; // Earth's radius ~6,378,137m

//       const geoFilter = {
//         "location.coordinates": {
//           $geoWithin: {
//             $centerSphere: [[lng, lat], distanceInRadians],
//           },
//         },
//       };
//       orFilters.push(geoFilter);
//     }

//     // 4) Construct the final query object
//     // If we have both filters, we do: { $or: [locationFilter, geoFilter] }
//     // If we have only one filter, we can use it directly
//     // If we have none, that means no filters => (decide what to return, e.g. empty or all)
//     let combinedQuery = {};
//     if (orFilters.length === 1) {
//       combinedQuery = orFilters[0]; // e.g. just city/state/country, or just geo
//     } else if (orFilters.length > 1) {
//       combinedQuery = { $or: orFilters };
//     } else {
//       // No filters provided—if you want an empty response or all events
//       // Return empty array or handle however you prefer:
//       return res.status(200).json({
//         events: [],
//         totalCount: 0,
//         currentPage: parsedPage,
//         totalPages: 0,
//       });
//     }

//     // 5) Count total documents that match
//     const totalCount = await Event.countDocuments(combinedQuery);

//     // 6) Query for the actual documents, applying skip/limit & optional sorting
//     //    Sort by date ascending if needed (adjust field as appropriate)
//     const events = await Event.find(combinedQuery)
//       .sort({ date: 1 }) // Optional: if you'd like events sorted by date
//       .skip(skip)
//       .limit(parsedLimit)
//       .lean(); // lean() returns plain JS objects (faster)

//     // 7) Prepare pagination metadata
//     const totalPages = Math.ceil(totalCount / parsedLimit);

//     // 8) Return results
//     return res.status(200).json({
//       events,
//       totalCount,
//       currentPage: parsedPage,
//       totalPages,
//     });
//   } catch (error) {
//     console.error("Error in getCombinedEvents:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Both startDate and endDate are required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    // Parallel queries again for efficiency
    const [events, totalCount] = await Promise.all([
      Event.find({
        date: { $gte: start, $lte: end },
      })
        .lean()
        .skip(skip)
        .limit(parsedLimit)
        .sort({ date: 1 }),
      Event.countDocuments({
        date: { $gte: start, $lte: end },
      }),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error fetching events by date range:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEventsByLocationAndDateRange = async (req, res) => {
  try {
    const { city, state, country, startDate, endDate } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build location query
    const locationQuery = {};
    if (city) locationQuery["location.city"] = city;
    if (state) locationQuery["location.state"] = state;
    if (country) locationQuery["location.country"] = country;

    // Build date query
    const dateQuery = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateQuery.date = { $gte: start, $lte: end };
    }

    const query = { ...locationQuery, ...dateQuery };

    const [events, totalCount] = await Promise.all([
      Event.find(query).lean().skip(skip).limit(parsedLimit),
      Event.countDocuments(query),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error(
      "Error fetching events by location and date range:",
      error.message
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

const getEventsByRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);
    let parsedRadius = parseFloat(radius) || 10; // default 10

    const maxDistanceInMeters = parsedRadius * 1000;

    // Query
    const geoQuery = {
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [parsedLng, parsedLat] },
          $maxDistance: maxDistanceInMeters,
        },
      },
    };

    const [events, totalCount] = await Promise.all([
      Event.find(geoQuery).lean().skip(skip).limit(parsedLimit),
      Event.countDocuments(geoQuery),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error in getEventsByRadius controller:", error);
    res.status(500).json({ error: "Failed to fetch events by radius" });
  }
};

const getEventsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    if (!genre) {
      return res.status(400).json({ error: "Genre is required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [events, totalCount] = await Promise.all([
      Event.find({ genre }).lean().skip(skip).limit(parsedLimit),
      Event.countDocuments({ genre }),
    ]);

    return res.status(200).json({
      events,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error("Error fetching events by genre:", error.message);
    res.status(500).json({ message: "Error fetching events." });
  }
};

module.exports = {
  getEventById,
  getEventsByUserId,
  getEventsByDateRange,
  getEventsByLocationAndDateRange,
  getEventsByGenre,
  getEventsByRadius,
  getCombinedEvents,
  getNearbyEvents,

  getEventsByLocation,
};
