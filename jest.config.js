module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/migrations/",
    "/src/config/",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/src/migrations/"],
};
