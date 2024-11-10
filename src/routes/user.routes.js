const express = require("express");
const { User, Question } = require("../models");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// Create new user
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      status: "error",
      message: "User creation failed",
    });
  }
});

// Get user profile
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    // Check if user is requesting their own profile
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    const user = await User.findByPk(req.params.userId, {
      attributes: ["id", "email", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user profile",
    });
  }
});

// Get user's questions
router.get("/:userId/questions", authMiddleware, async (req, res) => {
  try {
    // Check if user is requesting their own questions
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const questions = await Question.findAndCountAll({
      where: { userId: req.params.userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      attributes: ["id", "content", "answer", "metadata", "createdAt"],
    });

    res.json({
      status: "success",
      data: {
        questions: questions.rows,
        pagination: {
          total: questions.count,
          page,
          pages: Math.ceil(questions.count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user questions:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user questions",
    });
  }
});

module.exports = router;
