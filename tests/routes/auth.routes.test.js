const request = require("supertest");
const app = require("../../src/server");
const { createTestUser, cleanupTestUsers, runTest } = require("../test-utils");
const { sequelize } = require("../../src/models");

describe("Authentication Routes", () => {
  let testUser;
  const testPassword = "testPassword123";

  beforeAll(async () => {
    await runTest(async () => {
      testUser = await createTestUser({ password: testPassword });
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testPassword,
      });
      authToken = loginResponse.body.data.accessToken;
    }, "User Creation");
  });

  afterAll(async () => {
    await runTest(async () => {
      await cleanupTestUsers(testUser.email);
      sequelize.close();
    }, "User Cleanup");
  });

  it("should login a user successfully", async () => {
    await runTest(async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testPassword,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user).toHaveProperty("email", testUser.email);
    }, "User Login");
  });

  it("should fail login with incorrect credentials", async () => {
    await runTest(async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Invalid credentials");
    }, "Invalid Login");
  });

  it("should refresh token successfully", async () => {
    await runTest(async () => {
      // First login to get a refresh token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testPassword,
      });

      const refreshToken = loginResponse.body.data.refreshToken;

      // Then use the refresh token to get new tokens
      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    }, "Token Refresh");
  });

  it("should fail refresh with invalid token", async () => {
    await runTest(async () => {
      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken: "invalid_token",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Invalid refresh token");
    }, "Invalid Refresh Token");
  });

  it("should logout successfully", async () => {
    await runTest(async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Logged out successfully");
    }, "User Logout");
  });
});
