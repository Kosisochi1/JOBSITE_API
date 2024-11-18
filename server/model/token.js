const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      require: true,
    },
    userAgent: {
      type: String,
      require: true,
    },
    ip: {
      type: String,
      require: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);
const Token = mongoose.model("refreshToken", TokenSchema);

module.exports = Token;
