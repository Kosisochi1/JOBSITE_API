const express = require("express");
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

routeA.post("/apply-job/:id", authenticateUser, applyJob);
routeA.patch("/update-application/:id", authenticateUser, updateApplication);
routeA.get("/show-stats", authenticateUser, showStat);
routeA.get("/all-applications", authenticateUser, allApplication);
routeA.get("/single-application/:id", authenticateUser, singleApplication);
routeA.delete("/delete-application/:id", authenticateUser, removeApplication);

module.exports = routeA;
