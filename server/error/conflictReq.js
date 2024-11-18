const { StatusCodes } = require("http-status-codes");
const CustomErrorApi = require("./customError");

class ConflictReq extends CustomErrorApi {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.CONFLICT;
  }
}

module.exports = ConflictReq;
