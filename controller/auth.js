import Joi from "joi";
import { Users } from "../models/user.js";
import _ from "lodash";
import bycrpt from "bcrypt";

//Joi user validation function
export const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
};

export const loginUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }

  const passwordMatch = await bycrpt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    res.status(400).send("Invalid email or password");
    return;
  }

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(user, ["_id", "name", "email"]));
}
