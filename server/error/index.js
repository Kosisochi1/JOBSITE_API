const CustomErrorApi = require("./customError");
const BadRequest = require("./badRequest");
const NotFoundError = require("./notFound");
const InternalServerError = require("./internalError");
const ConflictReq = require("./conflictReq");
const UnathourizeError = require("./unathourize");

module.exports = {
  CustomErrorApi,
  BadRequest,
  NotFoundError,
  InternalServerError,
  ConflictReq,
  UnathourizeError,
};
