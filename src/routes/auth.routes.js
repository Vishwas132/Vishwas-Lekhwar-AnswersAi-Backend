const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    res.json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        ...tokens,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Login failed",
    });
  }
});

// Refresh token route
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if user exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    res.json({
      status: "success",
      data: tokens,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Refresh token expired",
      });
    }
    res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
    });
  }
});

// Logout route
router.post("/logout", authMiddleware, (req, res) => {
  // Since we're using JWTs, we don't need to do anything server-side
  // The client should remove the tokens from their storage
  res.json({
    status: "success",
    message: "Logged out successfully",
  });
});

module.exports = router;
