import { Users, validateUser } from "../models/user.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

// Validation for user updates
const validateUserUpdate = (user) => {
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
    password: PasswordComplexity(complexityOptions, "Password"),
  });

  return schema.validate(user);
};

// Get current user
const getCurrentUser = async (req, res) => {
  const user = await Users.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("User not found");
  res.status(200).send(user);
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await Users.find().select("-password -_v");
  if (!users) return res.status(404).send("No users found.");
  res.status(200).send(users);
};

// Register new user
const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new Users(_.pick(req.body, ["name", "email", "password"]));
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;

  const result = await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(result, ["_id", "name", "email"]));
};

// Update user
const updateUser = async (req, res) => {
  // Authorize - users can only update their own profile unless they're admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    return res
      .status(403)
      .send("Access denied: You can only update your own profile");
  }

  //validate req body
  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Find the specified user
  const user = await Users.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given Id was not found");

  user.name = req.body.name;
  user.email = req.body.email;

  //Hash the password if provided
  if (req.body.password) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(req.body.password, saltRounds);
  }

  const updatedUser = await user.save();

  // Generate new token if updating own profile
  if (req.user._id.toString() === req.params.id) {
    const token = updatedUser.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .status(200)
      .send(_.pick(updatedUser, ["_id", "name", "email"]));
  }

  res.status(200).send(_.pick(updatedUser, ["_id", "name", "email"]));
};

// Update user role
const updateUserRole = async (req, res) => {
  //Find the user by ID
  const user = await Users.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }

  //Validate the request body
  if (!req.body.role) {
    return res.status(400).send("Role is required");
  }

  //Ensuring the role is valid
  const validRoles = ["admin", "user"];
  if (!validRoles.includes(req.body.role)) {
    return res
      .status(400)
      .send("Invalid role. Role must be either admin or user");
  }

  //Update the user's role
  user.role = req.body.role;
  const updatedUser = await user.save();
  res.status(200).send(_.pick(updatedUser, ["_id", "name", "email", "role"]));
};

// Delete user
const deleteUser = async (req, res) => {
  //Prevent admin from deleting their own account
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).send("You cannot delete your own account");
  }

  const user = await Users.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("The given user ID was not found.");

  res.status(200).send(_.pick(user, ["_id", "name", "email"]));
};

export {
  getAllUsers,
  getCurrentUser,
  registerUser,
  updateUser,
  updateUserRole,
  deleteUser,
};
