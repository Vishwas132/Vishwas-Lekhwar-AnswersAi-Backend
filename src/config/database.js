require("dotenv").config();

module.exports = {
  development: {
    dbUrl:
      process.env.DATABASE_URL ||
      (process.env.NODE_ENV === "development"
        ? "postgres://postgres:postgres@localhost:5432/answersai_dev"
        : null),
    schema: process.env.DB_SCHEMA || "answersai_dev",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    dbUrl:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/answersai_dev",
    schema: process.env.DB_SCHEMA || "answersai_dev",
    logging: false,
  },
  production: {
    dbUrl:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/answersai_prod",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
