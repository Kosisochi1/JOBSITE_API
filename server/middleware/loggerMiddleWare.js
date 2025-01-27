const morgan = require("morgan");
const logger = require("../logger");
const { http } = require("winston");

const stream = {
  write: (massage) => logger.http(massage),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleWare = morgan("common", { stream, skip });

module.exports = morganMiddleWare;
