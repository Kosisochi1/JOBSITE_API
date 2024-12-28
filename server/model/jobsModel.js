const { string } = require("joi");
const mongoose = require("mongoose");
// const { type } = require("server/reply");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  JobTitle: {
    type: String,
    require: true,
  },
  Qualification: {
    type: String,
  },
  Description: {
    type: String,
    require: true,
  },
  JobType: {
    type: String,
    enum: ["Intern", "Full-Time", "Contract"],
    default: "Intern",
    require: true,
  },
  Location: {
    type: String,
    require: true,
  },
  Salary: {
    Currency: {
      type: String,
      trim: true,
      default: "NGN",
    },
    Min: {
      type: Number,
      trim: true,
      default: 0,
    },
    Max: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  NumberOfApplicant: {
    type: Number,
    default: 0,
  },

  Expires: {
    type: Date,
  },
  // NumberOfApplicant: {
  //   type: Number,
  //   default: 0,
  // },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const JobsModel = mongoose.model("job", JobSchema);

module.exports = JobsModel;
