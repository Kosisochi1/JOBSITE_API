const Joi = require("joi");
const userSchema = require("../model/userAuthModel");
const jobSchema = require("../model/jobsModel");
const apllicationSchema = require("../model/applicationModel");
const { enabled } = require("../app");

const validateUser = async (req, res, next) => {
  const enumValue = {
    admin: "admin",
    employee: "employee",
    employer: "employer",
  };
  try {
    const userSchema = Joi.object({
      Username: Joi.string()
        .required()
        .trim()
        .max(15)
        .min(6)
        .alphanum()
        .pattern(/^[a-zA-Z0–9_]+$/),
      Email: Joi.string().email().required(),
      Password: Joi.string()
        .required()
        .alphanum()
        .min(6)
        .max(12)
        .pattern(/^[a-zA-Z0–9_]+$/),
      UserType: Joi.string()
        .valid(...Object.values(enumValue))
        .required(),

      PhoneNumber: Joi.number().required(),
    });
    await userSchema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    console.log(error.details[0].message);
    return res.status(400).json({ message: `${error.details[0].message}` });
  }
};

const validateUserLogin = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      Email: Joi.string().email().required(),
      Password: Joi.string()
        .required()
        .alphanum()
        .min(6)
        .max(12)
        .pattern(/^[a-zA-Z0–9_]+$/),
    });
    await userSchema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.details[0].message}` });
  }
};

const validateJob = async (req, res, next) => {
  const enumValue = {
    Intern: "Intern",
    Full_Time: "Full-Time",
    Contract: "Contract",
  };
  try {
    const jobSchema = Joi.object({
      JobTitle: Joi.string().required().max(50),
      Qualification: Joi.string().required().max(100),
      Description: Joi.string().required(),
      JobType: Joi.string()
        .valid(...Object.values(enumValue))
        .required(),
      Location: Joi.string().required(),
      Salary: Joi.object({
        Currency: Joi.string().trim(),
        Min: Joi.number(),
        Max: Joi.number(),
      }),

      Expires: Joi.date(),
    });

    await jobSchema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.details[0].message}` });
  }
};

const validateApplication = async (req, res, next) => {
  const enumValue = {
    Pending: "Pending",
    Interviewed: "Interviewed",
    Expired: "Expired",
  };
  try {
    const apllicationSchema = Joi.object({
      FirstName: Joi.string()
        .required()
        .max(20)
        .pattern(/^[a-zA-Z0–9_]+$/),
      LastName: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0–9_]+$/),
      OtherName: Joi.string().pattern(/^[a-zA-Z0–9_]+$/),
      Education: Joi.array().items(
        Joi.object({
          InstitutionName: Joi.string().required(),
          Start: Joi.date().required(),
          End: Joi.date(),
        })
      ),
      Experience: Joi.array().items(
        Joi.object({
          NameOfSchool: Joi.string(),
          Start: Joi.date(),
          End: Joi.date(),
        })
      ),
      Email: Joi.string().email(),
      Status: Joi.string().valid(...Object.values(enumValue)),
    });
    await apllicationSchema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.details[0].message}` });
  }
};

module.exports = {
  validateUser,
  validateUserLogin,
  validateJob,
  validateApplication,
};
