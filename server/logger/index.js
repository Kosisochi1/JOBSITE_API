const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs" }),
    new winston.transports.Http({
      level: "warn",
      format: winston.format.json(),
    }),
  ],
});

module.exports = logger;
