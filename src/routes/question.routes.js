const express = require("express");
const { ChatAnthropic } = require("@langchain/anthropic");
const { Question } = require("../models");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createQuestionValidation,
  questionIdParamValidation,
} = require("../middleware/validation.middleware");
const router = express.Router();

// Create new question and get AI answer
router.post("/", authMiddleware, createQuestionValidation, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    // Start timing for metadata
    const startTime = Date.now();

    try {
      // Initialize Claude 3 Haiku with Langchain
      const model = new ChatAnthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        temperature: 0.7,
        maxTokens: 500,
        modelName: "claude-3-haiku-20240307",
      });
      // Get AI response
      const aiResponse = await model.invoke([
        {
          role: "user",
          content: content,
        },
      ]);

      // Calculate processing time
      const processingTime = Date.now() - startTime;

      // Save question and answer
      const question = await Question.create({
        userId,
        content,
        answer: aiResponse.content,
        metadata: {
          model: "claude-3-haiku-20240307",
          processingTime,
          tokenCount: aiResponse.content.length, // Approximate token count
        },
      });

      res.status(201).json({
        status: "success",
        data: {
          question: {
            id: question.id,
            content: question.content,
            answer: question.answer,
            metadata: question.metadata,
            createdAt: question.createdAt,
          },
        },
      });
    } catch (aiError) {
      console.error("AI processing error:", aiError);

      // Handle AI service errors gracefully
      return res.status(503).json({
        status: "error",
        message: "AI service temporarily unavailable. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Question creation error:", error);
    res.status(500).json({
      status: "error",
      message: "Error processing question",
    });
  }
});

// Get specific question
router.get(
  "/:questionId",
  authMiddleware,
  questionIdParamValidation,
  async (req, res) => {
    try {
      const question = await Question.findOne({
        where: {
          id: req.params.questionId,
          userId: req.user.userId,
        },
      });

      if (!question) {
        return res.status(404).json({
          status: "error",
          message: "Question not found",
        });
      }

      res.json({
        status: "success",
        data: { question },
      });
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({
        status: "error",
        message: "Error fetching question",
      });
    }
  }
);

module.exports = router;
