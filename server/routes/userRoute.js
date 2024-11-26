const express = require("express");
const {
  getAllUsers,
  singleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermission,
} = require("../auths/authentication");

const router = express.Router();

router.get(
  "/allUsers",
  authenticateUser,
  authorizePermission("admin"),
  getAllUsers
);

router.get("/currentUser", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updatePassword", authenticateUser, updatePassword);
router.get("/singleUser/:id", authenticateUser, singleUser);

module.exports = router;
