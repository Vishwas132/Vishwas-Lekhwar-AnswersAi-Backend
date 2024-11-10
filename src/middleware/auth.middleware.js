const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authorization token required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User no longer exists",
      });
    }

    // Attach user to request object
    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Authentication error",
    });
  }
};

module.exports = authMiddleware;
