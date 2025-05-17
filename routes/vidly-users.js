import express from "express";
import { authorize, authorizeRole } from "../middleware/authorization.js";
import validateObjectId from "../middleware/validateId.js";
import * as userController from "../controller/users.js";

const UserRouter = express.Router();

UserRouter.param("id", validateObjectId);

UserRouter.get("/me", authorize, userController.getCurrentUser);

UserRouter.route("/")
  .get(authorizeRole(["admin"]), userController.getAllUsers)
  .post(userController.registerUser);

UserRouter.route("/:id")
  .put(authorize, userController.updateUser)
  .delete(authorizeRole(["admin"]), userController.deleteUser);

UserRouter.patch(
  "/:id/role",
  authorizeRole(["admin"]),
  userController.updateUserRole
);

export default UserRouter;
