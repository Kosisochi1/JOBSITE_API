const { REQUEST_TIMEOUT } = require("http-status-codes");
const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  FirstName: {
    type: String,
    require: true,
  },
  LasttName: {
    type: String,
    require: true,
  },
  OrderName: {
    type: String,
  },
  Education: [
    {
      InstitutionName: { type: String },
      Start: { type: Date },
      End: { type: Date },
    },
  ],
  Experience: [
    {
      NameOfCompany: { type: String },
      Start: { type: Date },
      End: { type: Date },
    },
  ],
  Email: {
    type: String,
    require: true,
  },
  Status: {
    type: String,
    enum: ["Pending", "Interviewed", "Expired"],
    default: "Pending",
  },
  Resume: {
    type: String,
  },
  Job_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job",
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const ApplicationModel = mongoose.model("application", ApplicationSchema);
module.exports = ApplicationModel;
