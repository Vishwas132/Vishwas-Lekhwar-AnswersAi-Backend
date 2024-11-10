const request = require("supertest");
const app = require("../../src/server");
const { createTestUser, cleanupTestUsers, runTest } = require("../test-utils");
const { test } = require("../../src/config/database");
const { sequelize } = require("../../src/models");

describe("Question Routes", () => {
  let testUser;
  let authToken;
  let createdQuestionId;
  const testPassword = "testPassword123";

  beforeAll(async () => {
    await runTest(async () => {
      // Create a test user and get authentication token
      testUser = await createTestUser({ password: testPassword });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testPassword,
      });

      authToken = loginResponse.body.data.accessToken;
    }, "Test User Setup");
  });

  afterAll(async () => {
    await runTest(async () => {
      await cleanupTestUsers(testUser.email);
      sequelize.close();
    }, "User Cleanup");
  });

  it("should create a new question", async () => {
    await runTest(async () => {
      const response = await request(app)
        .post("/api/questions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "What is the capital of India?",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.question).toHaveProperty("id");
      expect(response.body.data.question).toHaveProperty("content");
      expect(response.body.data.question).toHaveProperty("answer");
      expect(response.body.data.question).toHaveProperty("metadata");
      expect(response.body.data.question.content).toBe(
        "What is the capital of India?"
      );

      createdQuestionId = response.body.data.question.id;
    }, "Create Question");
  });

  it("should get a specific question", async () => {
    await runTest(async () => {
      const response = await request(app)
        .get(`/api/questions/${createdQuestionId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.question).toHaveProperty(
        "id",
        createdQuestionId
      );
      expect(response.body.data.question).toHaveProperty("content");
      expect(response.body.data.question).toHaveProperty("answer");
      expect(response.body.data.question).toHaveProperty("metadata");
    }, "Get Specific Question");
  });

  it("should fail to create question without authentication", async () => {
    await runTest(async () => {
      const response = await request(app).post("/api/questions").send({
        content: "This should fail",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Authorization token required");
    }, "Unauthorized Question Creation");
  });

  it("should fail to access another user's question", async () => {
    await runTest(async () => {
      // Create another user and their question
      const otherUser = await createTestUser();
      const otherLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: otherUser.email,
          password: testPassword,
        });

      const otherAuthToken = otherLoginResponse.body.data.accessToken;

      // Try to access the first user's question with the second user's token
      const response = await request(app)
        .get(`/api/questions/${createdQuestionId}`)
        .set("Authorization", `Bearer ${otherAuthToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Question not found");

      // Cleanup the other test user
      await cleanupTestUsers(otherUser.email);
    }, "Unauthorized Question Access");
  });

  it("should fail to access question without authentication", async () => {
    await runTest(async () => {
      const response = await request(app).get(
        `/api/questions/${createdQuestionId}`
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Authorization token required");
    }, "Unauthenticated Question Access");
  });
});
