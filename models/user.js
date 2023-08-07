import mongoose from "mongoose";
import crypto from 'crypto'
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});



userSchema.methods.getResetPasswordToken = function (password) {
  const resetToken = crypto.randomBytes(16).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest(`hex`);

  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;

  return resetToken;
};

mongoose.models = {}

export const User = new mongoose.model("User", userSchema)