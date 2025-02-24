const express = require("express");
const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { validateJob } = require("../middleware/validators");
const {
  authenticateUser,
  authorizePermission,
} = require("../auths/authentication");

const router = express.Router();

router.post(
  "/jobs",
  authenticateUser,
  authorizePermission("admin" || "employer"),
  validateJob,
  createJob
);
router.get("/jobs", authenticateUser, getAllJobs);
router.get("/job/:id", authenticateUser, getSingleJob);
router.patch(
  "/job/:id",
  authenticateUser,
  authorizePermission("admin" || "employer"),
  updateJob
);
router.delete(
  "/job/:id",
  authenticateUser,
  authorizePermission("admin" || "employer"),
  deleteJob
);

module.exports = router;
