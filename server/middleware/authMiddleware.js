const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided or malformed header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // typically includes user id, email, role
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ msg: "Token is invalid or expired" });
  }
};

module.exports = authMiddleware;
