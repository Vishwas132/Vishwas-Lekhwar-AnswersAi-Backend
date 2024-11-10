const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/database.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    schema: config.schema || "answersai_dev",
    logging: config.logging || false,
    pool: {
      max: config.pool?.max || 5,
      min: config.pool?.min || 0,
      acquire: config.pool?.acquire || 30000,
      idle: config.pool?.idle || 10000,
    },
    dialectOptions: {
      ...config.dialectOptions,
      searchPath: config.schema || "answersai_dev",
    },
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
