// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// console.log("JWT_SECRET: ", JWT_SECRET);

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   console.log("Authorization header:", authHeader);
//   if (!authHeader)
//     return res.status(401).json({ message: "Unauthorized: No token provided" });

//   const token = authHeader.split(" ")[1]; // Extract token part

//   console.log("Token received:", token); // Log the received token

//   if (!token)
//     return res
//       .status(401)
//       .json({ message: "Unauthorized: Token format incorrect" });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("Token verification error:", err.message); // Log the error message
//       return res.status(403).json({ message: "Forbidden: Invalid token" });
//     }

//     const decodedToken = jwt.decode(token);
//     console.log("Token expiration time:", new Date(decodedToken.exp * 1000));

//     req.user = user; // Attach the user to the request object
//     console.log("Authenticated User:", req.user);
//     next();
//   });
// };

// module.exports = authenticateToken;

const jwt = require("jsonwebtoken");
const axios = require("axios"); // Make sure to import axios
const JWT_SECRET = process.env.JWT_SECRET;
const API_URL = process.env.API_URL; // Ensure you have the API_URL defined

console.log("JWT_SECRET: ", JWT_SECRET);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the access token part

  console.log("Token received:", token); // Log the received token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token format incorrect" });
  }

  // Verify the access token
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      console.error("Token verification error:", err.message); // Log the error message

      // Check if the error is due to token expiration
      if (err.name === "TokenExpiredError") {
        const refreshToken =
          req.body.refreshToken || req.headers["x-refresh-token"]; // Get the refresh token from body or headers
        console.log("Using refresh token for request:", refreshToken);

        if (!refreshToken) {
          return res
            .status(403)
            .json({ message: "Forbidden: Refresh token required" });
        }

        try {
          const refreshResponse = await axios.post(
            `${API_URL}/user/refresh-token`,
            { token: refreshToken }
          );
          const newToken = refreshResponse.data.token;

          // Update the authorization header with the new token
          req.headers["authorization"] = `Bearer ${newToken}`;

          // Verify the new access token
          jwt.verify(newToken, JWT_SECRET, (err, user) => {
            if (err) {
              return res
                .status(403)
                .json({ message: "Forbidden: Invalid new access token" });
            }

            req.user = user; // Attach the user to the request object
            console.log("Authenticated User after refresh:", req.user);
            next(); // Proceed to the next middleware or route
          });
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError.message);
          return res
            .status(403)
            .json({ message: "Forbidden: Unable to refresh token" });
        }
      } else {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
    } else {
      req.user = user; // Attach the user to the request object
      console.log("Authenticated User:", req.user);
      next(); // Proceed to the next middleware or route
    }
  });
};

module.exports = authenticateToken;
