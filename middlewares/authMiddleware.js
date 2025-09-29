const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return res.status(403).json({error: `${role} role required to access this`})
    } else {
      next();
    }
  }
}

module.exports = {authMiddleware, roleMiddleware}