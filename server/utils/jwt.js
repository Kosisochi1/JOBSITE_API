const jwt = require("jsonwebtoken");
require("dotenv").config();

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.SECRETE_KEY, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRETE_KEY);
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const token = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
  });
  const oneDay = 1000 * 60 * 60 * 24;
  const oneDayPlus = 1000 * 60 * 60 * 24 * 12;

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    maxAge: new Date(Date.now() + oneDayPlus),
  });
};

module.exports = {
  createJWT,
  verifyToken,
  attachCookiesToResponse,
};
