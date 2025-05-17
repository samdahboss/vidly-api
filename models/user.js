import Joi from "joi";
import { model, Schema } from "mongoose";
import PasswordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";
import config from "config";

//Joi user validation function
export const validateUser = (user) => {
  const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: PasswordComplexity(complexityOptions, "Password").required(),
    role: Joi.string().valid("admin", "user").default("user"),
  });

  return schema.validate(user);
};

//Defining the User Schema
const userSchema = new Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get("jwt_private_key")
  );
  return token;
};

//exporting the user model
export const Users = new model("users", userSchema);
