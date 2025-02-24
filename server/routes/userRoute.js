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
  "/all_users",
  authenticateUser,
  authorizePermission("admin"),
  getAllUsers
);

router.get("/current_user", authenticateUser, showCurrentUser);
router.patch("/update_user", authenticateUser, updateUser);
router.patch("/update_password", authenticateUser, updatePassword);
router.get("/single_user/:id", authenticateUser, singleUser);

module.exports = router;
