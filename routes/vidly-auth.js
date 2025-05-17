import express from "express";
import { loginUser } from "../controller/auth.js";

const AuthRouter = express.Router();

//Route to login a user
AuthRouter.route("/").post(loginUser);

export default AuthRouter;
