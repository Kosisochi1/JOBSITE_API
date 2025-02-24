const express = require("express");
const { validateApplication } = require("../middleware/validators");
const {
  applyJob,
  updateApplication,
  allApplication,
  singleApplication,
  removeApplication,
  showStat,
} = require("../controllers/applicatuion");
const multer = require("multer");
const { authenticateUser } = require("../auths/authentication");
const upload = multer({ dest: "/uploads" });

const routeA = express.Router();

routeA.post(
  "/application/:id",
  authenticateUser,
  validateApplication,
  applyJob
);
routeA.patch("/application_update/:id", authenticateUser, updateApplication);
routeA.get("/stats", authenticateUser, showStat);
routeA.get("/all_application", authenticateUser, allApplication);
routeA.get("/application/:id", authenticateUser, singleApplication);
routeA.delete("/remove_application/:id", authenticateUser, removeApplication);

module.exports = routeA;
