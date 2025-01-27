const { StatusCodes } = require("http-status-codes");
const UserModel = require("../model/userAuthModel");
const Job = require("../model/jobsModel");
const ApplicantModel = require("../model/applicationModel");
const logger = require("../logger");
const CustomErr = require("../error");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// const { profilePicture } = require("./authUserController");

const applyJob = async (req, res) => {
  const { FirstName, LastName, Email } = req.body;
  const { id } = req.params;
  console.log(req.user);

  if (!FirstName || !LastName || !Email) {
    throw new CustomErr.BadRequest("Check empty Fields");
  }

  const job = await Job.findOne({ _id: id });
  // check if Job exist
  if (!job) {
    throw new CustomErr.NotFoundError(`Job with ID:${req.params.id} found`);
  }
  //check existing application
  const existingAppllication = await ApplicantModel.findOne({
    Job_Id: id,
  });

  if (existingAppllication) {
    throw new CustomErr.NotFoundError("Existing Application");
  }

  console.log(job._id);
  req.body.User_Id = req.user._id;
  req.body.Job_Id = job._id;

  const application = await ApplicantModel.create(req.body);

  res
    .status(StatusCodes.OK)
    .json({ massage: "Application submited", data: application });
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  //check if the application exist
  const application = await ApplicantModel.findOne({ _id: id });
  if (!application) {
    throw new CustomErr.NotFoundError(`No application with ID:${id}`);
  }
  const jobUpdate = await ApplicantModel.updateOne({ _id: id }, req.body);

  return res
    .status(StatusCodes.OK)
    .json({ massage: "APplication Updated", data: jobUpdate });
};

const allApplication = async (req, res) => {
  const { Status, sort } = req.query;
  let queryObject = { User_Id: req.user._id };
  if (req.user.UserType === "employer" || "admin") {
    queryObject = {};
  }

  if (Status) {
    queryObject.Status = { $regex: Status, $option: "i" };
  }

  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  let queryResult = ApplicantModel.find(queryObject);

  if (sort === "a-z") {
    queryResult = queryResult.sort("Status");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-Status");
  }

  queryResult = queryResult.skip(skip).limit(limit);

  const searchResult = await queryResult;

  if (!searchResult) {
    throw new CustomErr.InternalServerError("Server Error");
  }
  if (searchResult.length === 0) {
    throw new CustomErr.NotFoundError("Nothing Found");
  }

  return res
    .status(StatusCodes.OK)
    .json({ massage: "All Applications", data: searchResult });
};
const singleApplication = async (req, res) => {
  const { id } = req.params;

  const application = await ApplicantModel.findOne({ _id: id });

  if (!application) {
    throw new CustomErr.NotFoundError(
      `Application with ID: ${id} deos not exist`
    );
  }

  return res.status(StatusCodes.OK).json({ data: application });
};

const removeApplication = async (req, res) => {
  const { id } = req.params;
  const application = await ApplicantModel.findOne({ _id: id });
  if (!application) {
    throw new CustomErr.NotFoundError(
      `Application with ID: ${id} deos not exist`
    );
  }
  if (req.user._id !== application.User_Id) {
    throw new CustomErr.UnathourizeError(
      "Not Authourize to carry out the actions"
    );
  }

  await ApplicantModel.deleteOne({ _id: id });

  return res.status(StatusCodes.OK).json({ massage: "Deleted" });
};

const showStat = async (req, res) => {
  const id = req.user._id;
  if (req.user.UserType === "employer") {
    let stats = await ApplicantModel.aggregate([
      { $match: { User_Id: new ObjectId(id) } },
      { $group: { _id: "$Status", count: { $sum: 1 } } },
    ]);
    stats = stats.reduce((acc, cur) => {
      const { _id: keyValue, count } = cur;
      acc[keyValue] = count;
      return acc;
    }, {});
  }
  const job = await Job.findOne({ User_Id: req.user._id });
  let stats = await ApplicantModel.aggregate([
    { $match: { User_Id: new ObjectId(job.User_Id) } },
    { $group: { _id: "$Status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, cur) => {
    const { _id: keyValue, count } = cur;
    acc[keyValue] = count;
    return acc;
  }, {});
  // }

  const jobStat = {
    // ["Pending", "Interviewed", "Expired"],
    Pending: stats.Pending || 0,
    Interviewd: stats.Interviewd || 0,
    Expired: stats.Expired || 0,
  };
  res.status(StatusCodes.OK).json({ jobStat, stats });
};
module.exports = {
  applyJob,
  updateApplication,
  allApplication,
  singleApplication,
  removeApplication,
  showStat,
};
