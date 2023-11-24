import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  // username: Joi.string().required(),
  email: Joi.string().pattern(emailRegex),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegex),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);

export default User;
