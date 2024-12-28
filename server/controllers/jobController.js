const JobModel = require("../model/jobsModel");
const logger = require("../logger/index");
const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../error");
const { countDocuments } = require("../model/userAuthModel");

const createJob = async (req, res) => {
  logger.info("[Jobs] => Create Jobs process Started");

  req.body.User_Id = req.user._id;
  const job = await JobModel.create(req.body);

  if (!job) {
    throw new CustomErr.InternalServerError("Server Error");
  }

  res.status(StatusCodes.CREATED).json({ massage: "Job created", data: job });
};

const getAllJobs = async (req, res) => {
  const { JobTitle, JobType, Location, SalaryMin, SalaryMax, sort } = req.query;

  const queryObject = { User_Id: req.user._id };

  if (JobTitle) {
    queryObject.JobTitle = { $regex: JobTitle, $options: "i" };
  }
  if (JobType) {
    queryObject.JobTitle = { $regex: JobType, $options: "i" };
  }
  if (Location) {
    queryObject.Location = { $regex: Location, $options: "i" };
  }
  if (SalaryMax && SalaryMin) {
    queryObject["Salary.Min"] = { $gte: SalaryMin };
    queryObject["Salary.Max"] = { $lte: SalaryMax };
  } else if (SalaryMax) {
    queryObject["Salary.Max"] = { $lte: SalaryMax };
  } else if (SalaryMin) {
    queryObject["Salary.Min"] = { $gte: SalaryMin };
  }

  // pagination

  const page = 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  // Query result
  let queryResult = JobModel.find(queryObject);
  if (sort === "a-z") {
    queryResult = queryResult.sort("Expires");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-Expires");
  }
  queryResult = queryResult.skip(skip).limit(limit);
  const searchResult = await queryResult;

  if (!searchResult) {
    throw new CustomErr.InternalServerError("Server Error");
  }

  if (searchResult.length === 0) {
    throw new CustomErr.NotFoundError("No Job Found");
  }

  const totalJob = await JobModel.countDocuments(queryResult);
  const numberOfPage = totalJob / limit;

  return res.status(StatusCodes.OK).json({
    searchResult,
    totalJob,
    numberOfPage,
  });
};

// Single Job
const getSingleJob = async (req, res) => {
  const { id } = req.params;

  const job = await JobModel.findOne({ _id: id });

  if (!job) {
    throw new CustomErr.NotFoundError(`Job with ${id} not found`);
  }

  return res.status(StatusCodes.OK).json({ data: job });
};

// Update Job

const updateJob = async (req, res) => {
  const { id } = req.params;
  // const {
  //   JobTitle,
  //   Qualification,
  //   Description,
  //   JobType,
  //   Location,
  //   Salary,
  //   Expires,
  // } = req.body;

  const job = await JobModel.findById({ _id: id, User_Id: req.user._id });

  if (!job) {
    throw new CustomErr.NotFoundError(`No job with ${id} found`);
  }

  const updateJob = await JobModel.updateMany(req.body);

  if (!updateJob) {
    throw new CustomErr.InternalServerError("Server Error");
  }

  return res.status(StatusCodes.OK).json({ massage: "Updated" });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removeJob = await JobModel.findByIdAndDelete({
    _id: id,
    User_Id: req.user._id,
  });

  if (!removeJob) {
    throw new CustomErr.NotFoundError(`Job with ID:${id} No found`);
  }
  return res.status(StatusCodes.OK).json({ massage: "Job deleted" });
};

module.exports = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
