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
const { validateUser, validateUserLogin } = require("../middleware/validators");

const multer = require("multer");
const { authenticateUser } = require("../auths/authentication");
const upload = multer({ dest: "uploads/" });

const route = express.Router();

route.post("/users", validateUser, createUser);
route.post("/login", validateUserLogin, loginUser);
route.post("/verify", verifyUser);
route.post("/password", forgotPassword);
route.patch("/new_password", passwordReset);
route.get("/logout", logout);
route.post(
  "/picture",
  authenticateUser,
  upload.single("image"),
  profilePicture
);

module.exports = route;
