const { StatusCodes } = require("http-status-codes");
// const CustomError = require("./customError");
const CustomErrorApi = require("./customError");

class BadRequest extends CustomErrorApi {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
