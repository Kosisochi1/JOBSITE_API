const express = require("express");
const {
  createUser,
  loginUser,
  verifyUser,
  forgotPassword,
  passwordReset,
  logout,
  profilePicture,
} = require("../controllers/authUserController");

const route = express.Router();

route.post("/create-user", createUser);
route.post("/login", loginUser);
route.post("/verify-user", verifyUser);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", passwordReset);
route.get("/logout", logout);
route.post("/profile-picture", profilePicture);

module.exports = route;
