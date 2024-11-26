const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../error");

const checkPermission = (requestUser, resourceId) => {
  if (requestUser.UserType === "admin") return;
  if (requestUser._id === resourceId.toString()) return;

  throw new CustomErr.UnathourizeError("You Do not have access to this route");
};

module.exports = checkPermission;
