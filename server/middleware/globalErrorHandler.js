const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // customm default
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || " Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered  for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;

    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = ` No Item found with ID ${err.value}`;

    customError.statusCode = 404;
  }
  if (customError.msg === "jwt expired") {
    customError.msg = "Please Login";
    customError.statusCode = 500;
  }
  // console.log(err);

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
