const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET: ", JWT_SECRET);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);
  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  const token = authHeader.split(" ")[1]; // Extract token part

  console.log("Token received:", token); // Log the received token

  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized: Token format incorrect" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err.message); // Log the error message
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user; // Attach the user to the request object
    console.log("Authenticated User:", req.user);
    next();
  });
};

module.exports = authenticateToken;
