require("express-async-errors");
const express = require("express");
const db = require("./database");
const logger = require("./logger/index");
require("dotenv").config();

const { StatusCodes } = require("http-status-codes");

const CustomError = require("./error");
const cookie_parser = require("cookie-parser");
const authUserRoute = require("./routes/authUserRoute");
const usersRoute = require("./routes/userRoute");
const jobRoute = require("./routes/jobRoute");
const applicationRoute = require("./routes/applicationRoute");

// midlleware

const errorHandlerMiddleware = require("./middleware/globalErrorHandler");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.use("/api/v1/auth-user", authUserRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/jobs", jobRoute);
app.use("/api/v1/applications", applicationRoute);

app.get("*", (req, res) => {
  // logger.info("[Route] =>  Not Found");
  // throw new CustomError.BadRequest(" Route Not Found");

  res
    .status(StatusCodes.NOT_FOUND)
    .json({ massage: "Route Not Found", data: null });
});

app.use(errorHandlerMiddleware);

db.connect();
app.listen(PORT, () => {
  logger.info("[Server] => Started");
});
