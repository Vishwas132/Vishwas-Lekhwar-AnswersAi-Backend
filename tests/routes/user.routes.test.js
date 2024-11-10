const request = require("supertest");
const app = require("../../src/server");
const { createTestUser, cleanupTestUsers, runTest } = require("../test-utils");
const { sequelize } = require("../../src/models");

describe("User Routes", () => {
  let testUser;
  let authToken;
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

  it("should get user profile", async () => {
    await runTest(async () => {
      const response = await request(app)
        .get(`/api/users/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user).toHaveProperty("id", testUser.id);
      expect(response.body.data.user).toHaveProperty("email", testUser.email);
      expect(response.body.data.user).toHaveProperty("createdAt");
      expect(response.body.data.user).toHaveProperty("updatedAt");
      expect(response.body.data.user).not.toHaveProperty("password");
    }, "Get User Profile");
  });

  it("should get user's questions", async () => {
    await runTest(async () => {
      const response = await request(app)
        .get(`/api/users/${testUser.id}/questions`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("questions");
      expect(Array.isArray(response.body.data.questions)).toBe(true);
      expect(response.body.data).toHaveProperty("pagination");
      expect(response.body.data.pagination).toHaveProperty("total");
      expect(response.body.data.pagination).toHaveProperty("page");
      expect(response.body.data.pagination).toHaveProperty("pages");
    }, "Get User Questions");
  });

  it("should fail to access another user's profile", async () => {
    await runTest(async () => {
      const otherUser = await createTestUser();
      const response = await request(app)
        .get(`/api/users/${otherUser.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Access denied");

      await cleanupTestUsers(otherUser.email);
    }, "Unauthorized Profile Access");
  });

  it("should fail to access profile without authentication", async () => {
    await runTest(async () => {
      const response = await request(app).get(`/api/users/${testUser.id}`);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Authorization token required");
    }, "Unauthenticated Profile Access");
  });
});
