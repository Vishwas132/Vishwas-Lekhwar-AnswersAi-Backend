require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "answersai_dev",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    schema: process.env.DB_SCHEMA || "answersai_dev",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      searchPath: process.env.DB_SCHEMA || "answersai_dev",
    },
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "answersai_dev",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    schema: process.env.DB_SCHEMA || "answersai_dev",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      searchPath: process.env.DB_SCHEMA || "answersai_dev",
    },
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "answersai_prod",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    schema: process.env.DB_SCHEMA || "answersai_prod",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      searchPath: process.env.DB_SCHEMA || "answersai_prod",
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
