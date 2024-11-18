const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserAuthSchema = new Schema({
  Username: {
    type: String,
    require: true,
    trim: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  UserType: {
    type: String,
    enum: ["admin", "employee", "employer"],
    default: "employee",
  },
  PhoneNumber: {
    type: Number,
  },
  VerificationToken: {
    type: String,
    default: "",
  },
  IsVerify: {
    type: Boolean,
    default: false,
  },
  DateVerify: {
    type: Date,
  },
  PasswordToken: {
    type: String,
    default: "",
  },
  PasswordTokenExpDate: {
    type: Date,
  },
});

UserAuthSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return;

  const hash = await bycrypt.hash(this.Password, 10);
  this.Password = hash;
  next();
});

UserAuthSchema.methods.isValidPassword = async function (password) {
  const comparePassword = await bycrypt.compare(password, this.Password);
  return comparePassword;
};

const UserAuthModel = mongoose.model("user", UserAuthSchema);

module.exports = UserAuthModel;
