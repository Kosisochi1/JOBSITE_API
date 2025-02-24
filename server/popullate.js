require("dotenv").config();
const jobData = require("./Mock_job_data.json");
const applicationData = require("./Mock_application_data.json");

const jobModel = require("./model/jobsModel");
const applicationModel = require("./model/applicationModel");
const db = require("./database");

const start = async () => {
  try {
    await db.connect();
    await jobModel.create(jobData);
    await applicationModel.create(applicationData);
    process.exit(0);
  } catch (error) {
    console.log("Data population failed");
    process.exit(1);
  }
};

start();
