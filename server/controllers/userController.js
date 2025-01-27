const CustomErr = require("../error");
const UserModel = require("../model/userAuthModel");
const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../utils/checkPermission");
const createToken = require("../utils/createToken");
const { attachCookiesToResponse } = require("../utils/jwt");

const getAllUsers = async (req, res) => {
  const users = await UserModel.find({}).select("-Password");

  return res.status(StatusCodes.OK).json({ data: users });
};

const singleUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id }).select("-Password");
  if (!user) {
    throw new CustomErr.NotFoundError(`No User with ${id} Found`);
  }
  checkPermission(req.user, user._id);

  return res.status(StatusCodes.OK).json({ data: user });
};

const updateUser = async (req, res) => {
  const { Email, Username } = req.body;

  if (!Email || !Username) {
    throw new CustomErr.BadRequest("Invalid Fields");
  }

  const user = await UserModel.findOne({ _id: req.user._id }).select(
    "-Password"
  );

  if (!user) {
    throw new CustomErr.NotFoundError("User Not Found");
  }

  user.Email = Email;
  user.Username = Username;

  await user.save();

  const tokenUser = createToken(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ data: tokenUser });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomErr.BadRequest("Invalid Fields");
  }
  const user = await UserModel.findOne({ _id: req.user._id });
  const isValidPassword = await user.isValidPassword(oldPassword);

  if (!isValidPassword) {
    throw new CustomErr.UnathourizeError("Invalid Fields");
  }
  user.Password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password Successfull Change" });
};

module.exports = {
  getAllUsers,
  singleUser,
  updateUser,
  showCurrentUser,
  updatePassword,
};
