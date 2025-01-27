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

routeA.post("/jobs/:id", authenticateUser, applyJob);
routeA.patch("/jobs/:id", authenticateUser, updateApplication);
routeA.get("/show-stats", authenticateUser, showStat);
routeA.get("/jobs", authenticateUser, allApplication);
routeA.get("/job/:id", authenticateUser, singleApplication);
routeA.delete("/job/:id", authenticateUser, removeApplication);

module.exports = routeA;
