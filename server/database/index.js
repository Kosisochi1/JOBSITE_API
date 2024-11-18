const mongoose = require("mongoose");
const logger = require("../logger/index");
require("dotenv").config();

const connect = async (url) => {
  mongoose.connect(url || process.env.DB_URL || "mongodb://localhost:27017");
  mongoose.connection.on("connected", () => {
    logger.info("[Database] => Connected Successfully");
  });
  mongoose.connection.on("error", (err) => {
    logger.info(`[Database]=> Error${err} Occoured during Connection`);
  });
};

module.exports = { connect };
