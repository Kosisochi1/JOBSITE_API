const express = require("express");
const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const {
  authenticateUser,
  authorizePermission,
} = require("../auths/authentication");

const router = express.Router();

router.post(
  "/create-jobs",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  createJob
);
router.get("/all-jobs", authenticateUser, getAllJobs);
router.get("/single-user/:id", authenticateUser, getSingleJob);
router.patch(
  "/update-job/:id",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  updateJob
);
router.delete(
  "/delete-job/:id",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  deleteJob
);

module.exports = router;
