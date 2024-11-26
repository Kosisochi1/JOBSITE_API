const CustomErr = require("../error");
const { verifyToken, attachCookiesToResponse } = require("../utils/jwt");
const Token = require("../model/token");
// const attachCookiesToResponse = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  //   try {
  const { token, refreshToken } = req.cookies;

  if (token) {
    const accessToken = verifyToken(token);
    req.user = accessToken.user;

    return next();
  }

  const accessToken = verifyToken(refreshToken);
  const existingToken = await Token.findOne({
    userId: accessToken.user.userId,
    refreshToken: accessToken.refreshToken,
  });

  if (!existingToken || !existingToken?.isValid) {
    throw new CustomErr.UnathourizeError("Invalid Authentication");
  }

  attachCookiesToResponse({
    res,
    user: accessToken.user,
    refreshToken: accessToken.refreshToken,
  });
  req.user = accessToken.user;
  next();
  //   } catch (error) {
  //     throw new CustomErr.UnathourizeError("Invalid Authentication");
  //   }
};
const authorizePermission = (...UserTypes) => {
  return (req, res, next) => {
    if (!UserTypes.includes(req.user.UserType)) {
      throw new CustomErr.UnathourizeError("Authorize to this Route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
