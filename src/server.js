const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { sequelize } = require("./models");
const dbConfig = require("./config/database");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const questionRoutes = require("./routes/question.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      status: "error",
      message: "Duplicate entry error",
      errors: err.errors.map((e) => e.message),
    });
  }

  // Default error response
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Determine environment
const env = process.env.NODE_ENV || "development";
const dbConfiguration = dbConfig[env];

// Configure Umzug migrations
const umzug = new Umzug({
  migrations: {
    glob: ["migrations/*.js", { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: "SequelizeMeta",
    schema: dbConfiguration.schema || "public",
  }),
  logger: console,
});

// Run migrations
const runMigrations = async () => {
  try {
    await umzug.up();
    console.log("All migrations have been executed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Run migrations
    await runMigrations();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${env}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

// Export the app for testing
module.exports = app;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  startServer();
}
