const JobModel = require("../model/jobsModel");
const logger = require("../logger/index");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../error");

const createJob = async (req, res) => {
  logger.info("[Jobs] => Create Jobs process Started");

  const {
    JobTitle,
    Qualification,
    Description,
    JobType,
    Location,
    Salary,
    Expires,
  } = req.body;

  const job = await JobModel.create({
    JobType,
    Qualification,
    JobTitle,
    Description,
    Location,
    Salary,
    Expires,
    User_Id: req.user._id,
  });
  if (!job) {
    throw new CustomError.InternalServerError("Server Error");
  }

  res.status(StatusCodes.CREATED).json({ massage: "Job created", data: job });
};

const getAllJobs = async (req, res) => {};
module.exports = {
  createJob,
};
