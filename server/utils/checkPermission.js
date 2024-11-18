const { StatusCodes } = require("http-status-codes");

const checkPermission = (requestUser, resourceId) => {
  if (requestUser.UserType === "admin") return;
  if (requestUser._id === resourceId.toString()) return;
  else {
    return res.status(StatusCodes).json({ massage: "Unathourize" });
  }
};

module.exports = checkPermission;
