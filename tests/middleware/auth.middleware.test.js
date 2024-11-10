const jwt = require("jsonwebtoken");
const { runTest, cleanupTestUsers } = require("../test-utils");
const authMiddleware = require("../../src/middleware/auth.middleware");
const { User, sequelize } = require("../../src/models");

describe("Authentication Middleware", () => {
  let mockReq, mockRes, mockNext;
  const SECRET_KEY = process.env.JWT_SECRET || "test_secret";
  let testUser;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  beforeAll(async () => {
    await runTest(async () => {
      // Create a test user for authentication tests
      testUser = await User.create({
        email: `authtest-${Date.now()}@example.com`,
        password: "testPassword123",
      });
    }, "Create Test User");
  });

  afterAll(async () => {
    await runTest(async () => {
      await cleanupTestUsers(testUser.email);
      sequelize.close();
    }, "Cleanup Test User");
  });

  it("should pass authentication with valid token", async () => {
    await runTest(async () => {
      const token = jwt.sign({ userId: testUser.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe(testUser.id);
    }, "Valid Token Authentication");
  });

  it("should reject request without token", async () => {
    await runTest(async () => {
      mockReq = {
        headers: {},
      };

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: "Authorization token required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    }, "Missing Token Rejection");
  });

  it("should reject request with invalid token", async () => {
    await runTest(async () => {
      mockReq = {
        headers: {
          authorization: "Bearer invalid_token",
        },
      };

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    }, "Invalid Token Rejection");
  });

  it("should reject expired token", async () => {
    await runTest(async () => {
      // Create a token that has already expired
      const expiredToken = jwt.sign({ userId: testUser.id }, SECRET_KEY, {
        expiresIn: "1ms", // Immediately expires
      });

      // Wait a bit to ensure token has expired
      await new Promise((resolve) => setTimeout(resolve, 10));

      mockReq = {
        headers: {
          authorization: `Bearer ${expiredToken}`,
        },
      };

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        message: "Token expired",
      });
      expect(mockNext).not.toHaveBeenCalled();
    }, "Expired Token Rejection");
  });
});
