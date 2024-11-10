const { User } = require("../src/models");
const crypto = require("crypto");

// Utility function for creating test users with error handling
async function createTestUser(overrides = {}) {
  try {
    return await User.create({
      email: `test-${crypto.randomBytes(6).toString("hex")}@example.com`,
      password: overrides.password || "testPassword123",
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    throw new Error(`Failed to create test user: ${error.message}`);
  }
}

// Utility function for cleaning up test users with error handling
async function cleanupTestUsers(email) {
  try {
    await User.destroy({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.error("Error cleaning up test users:", error);
    throw new Error(`Failed to cleanup test users: ${error.message}`);
  }
}

// Utility function to run tests with consistent error handling
async function runTest(testFn, description = "Test") {
  try {
    await testFn();
  } catch (error) {
    console.error(`${description} failed:`, error);
    throw error; // Re-throw to ensure test framework catches the failure
  }
}

module.exports = {
  createTestUser,
  cleanupTestUsers,
  runTest,
};
