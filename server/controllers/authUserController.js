const { StatusCodes } = require("http-status-codes");
const UserModel = require("../model/userAuthModel");
const logger = require("../logger");
const Token = require("../model/token");
const {
  createJWT,
  verifyToken,
  attachCookiesToResponse,
} = require("../utils/jwt");
const createToken = require("../utils/createToken");
const checkPermission = require("../utils/checkPermission");
const CustomErr = require("../error");
const crypto = require("crypto");
const { sendmail } = require("../utils/mailSetUp");
const multer = require("multer");
const cloudinary = require("../integration/cloudinary");
const uplaod = multer({ dest: "uploads/" });
const fs = require("fs");

// create User
const createUser = async (req, res) => {
  logger.info("[User registration] => Started ");
  const { Username, Email, Password, PhoneNumber } = req.body;

  // check for user duplication in the database.
  logger.info("[User registration] => Check user Duplication");

  const userDuplicate = await UserModel.findOne({ Email });

  if (userDuplicate) {
    throw new CustomErr.ConflictReq("User already exist");
  }
  logger.info(
    "[User registration] => Check if this is first User to assign usertype "
  );

  const isFirstUser = (await UserModel.countDocuments({})) === 0;
  if (req.body.UserType === "admin") {
    throw new CustomErr.BadRequest("Bad Request check Feilds");
  }

  UserType = isFirstUser ? "admin" : `${req.body.UserType}`;

  // Generate the verification Token && Assign origin
  const VerificationToken = crypto.randomBytes(16).toString("hex");
  const origin = "http://localhost:3000/api/v1";

  // Create Users

  const newUser = await UserModel.create({
    UserType,
    Username,
    Email,
    Password,
    PhoneNumber,
    VerificationToken: VerificationToken,
  });

  if (!newUser) {
    throw new CustomErr.InternalServerError("Internal Server Error");
  }
  logger.info("[User registration] => Create Token ");

  const newToken = createToken(newUser);

  // attachCookiesToResponse({ res, user: newToken });
  logger.info("[User registration] => Completed ");

  // Send verification mail to verify account

  sendmail({
    name: newUser.Username,
    VerificationToken: newUser.VerificationToken,
    origin: origin,
    to: newUser.Email,
    subject: "USER VERIFICATION",
    html: `<h3>Hi ${newUser.Username}</h3>  </br>
    <p>Please Click link to Very  Account  <a href='${origin}/verify_user?verificationToken=${newUser.VerificationToken}&Email=${newUser.Email}'>Here</a> </p> `,
  });

  // Response !!!
  return res.status(StatusCodes.CREATED).json({
    Massage: "Check your Mail to Validate",
    data: {
      Username: newUser.Username,
      UserType: newUser.UserType,
      Email: newUser.Email,
      PhoneNumber: newUser.PhoneNumber,
    },
  });
};

// Login User
const loginUser = async (req, res) => {
  logger.info("[User Login] => Process Started ");

  // try {
  const { Email, Password } = req.body;

  // check for empty field
  if (!Email || !Password) {
    throw new CustomErr.BadRequest("Fill the empty Field");
  }

  //check for user in the database

  const userExist = await UserModel.findOne({ Email });

  if (!userExist) {
    throw new CustomErr.NotFoundError("No User Found");
  }

  const validateUser = await userExist.isValidPassword(Password);

  if (!validateUser) {
    throw new CustomErr.UnathourizeError("Invalid Credentials");
  }
  if (userExist.IsVerify === false) {
    throw new CustomErr.UnathourizeError(
      "Unthourize !!!, Please verify account"
    );
  }
  //create login Token

  const loginToken = createToken(userExist);
  const Response = {
    Username: userExist.Username,
    UserType: userExist.UserType,
    Email: userExist.Email,
    PhoneNumber: userExist.PhoneNumber,
  };

  let refreshToken = "";
  const existingToken = await Token.findOne({ userId: userExist._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomErr.UnathourizeError("Invalid Credentials");
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: loginToken, refreshToken });

    res
      .status(StatusCodes.OK)
      .json({ Massage: " Login Successfull", data: Response });
    return;
  }
  refreshToken = crypto.randomBytes(16).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, userId: userExist._id };

  await Token.create(userToken);

  //AttachToken to login

  attachCookiesToResponse({ res, user: loginToken, refreshToken });
  return res.status(StatusCodes.OK).json({
    Massage: " Login Successfull",
    data: Response,
  });
};

// User verification block

const verifyUser = async (req, res) => {
  const { verificationToken, Email } = req.query;
  const user = await UserModel.findOne({ Email });

  if (!user) {
    throw new CustomErr.NotFoundError("User not Matched");
  }

  if (verificationToken !== user.VerificationToken && Email !== user.Email) {
    throw new CustomErr.BadRequest("Please verify check and verify user");
  }

  user.IsVerify = true;
  user.VerificationToken = "";
  user.DateVerify = Date.now();
  user.save();

  return res.status(StatusCodes.OK).json({
    Massage: " User Verified",
    data: user,
  });
};

const forgotPassword = async (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    throw new CustomErr.BadRequest("Please Fill empty Feild");
  }
  const user = await UserModel.findOne({ Email });

  if (!user) {
    throw new CustomErr.NotFoundError("User Not Found");
  }
  const passwordToken = crypto.randomBytes(16).toString("hex");
  const origin = "http://localhost:3000/api/v1";

  sendmail({
    name: user.Username,
    to: user.Email,
    origin: origin,
    passwordToken: passwordToken,
    subject: "PASSWORD RESET",
    html: `<h3>Hi ${user.Username}</h3>  </br>
    <p>Please Click link to  RESET PASSWORD <a href='${origin}/forgot_password?passwordToken=${user.PasswordToken}&Email=${user.Email}'>Here</a> </p> `,
  });

  const tenMinutes = 1000 * 60 * 10;
  const passwordTokenExpDate = new Date(Date.now() + tenMinutes);
  console.log(passwordTokenExpDate);
  user.PasswordToken = passwordToken;
  user.PasswordTokenExpDate = passwordTokenExpDate;
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ Massage: "Please !!! Check Your Mail  for Password Link" });
};

const passwordReset = async (req, res) => {
  const { newPassword, Email } = req.body;
  // const timeNow = new Date(Date.now()) + 1;
  // console.log(timeNow);
  if (!newPassword) {
    throw new CustomErr.BadRequest("Please fill empty Feild");
  }

  const user = await UserModel.findOne({ Email: Email });

  if (user) {
    const curTime = new Date();
    console.log(req.query.passwordToken);

    if (
      user.PasswordTokenExpDate > curTime &&
      req.query.passwordToken === user.PasswordToken
    ) {
      user.Password = newPassword;
      user.PasswordTokenExpDate = null;
      user.PasswordToken = null;
      await user.save();
    }
  }

  return res
    .status(StatusCodes.OK)
    .json({ Massage: "Pasword Changed Successfull" });
  // } else {
  //   throw new CustomErr.UnathourizeError("Not Unathourized");
  // }
};

const logout = async (req, res) => {
  // await Token.findByIdAndDelete({ userId: req.userExist._id });
  res.clearCookie("token");

  res.clearCookie("refreshtoken");
  return res.status(StatusCodes.OK).json({ Massage: "Logout Successfull" });
};

// Profile Picture
const profilePicture = async (req, res) => {
  // uploading image to cloudinary and returning the returning the image url
  const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
  // deleting the image from the upload folder after uploading to cloudinary
  fs.unlink(req.file.path, (err) => {
    if (err) {
      throw new CustomErr.InternalServerError("Upload not Successful");
    }
  });
  return res
    .status(StatusCodes.OK)
    .json({ data: cloudinaryResponse.secure_url });
};

module.exports = {
  createUser,
  loginUser,
  verifyUser,
  forgotPassword,
  passwordReset,
  logout,
  profilePicture,
};
