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
  "/jobs",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  createJob
);
router.get("/jobs", authenticateUser, getAllJobs);
router.get("/job/:id", authenticateUser, getSingleJob);
router.patch(
  "/job/:id",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  updateJob
);
router.delete(
  "/job/:id",
  authenticateUser,
  authorizePermission("employer" || "admin"),
  deleteJob
);

module.exports = router;
