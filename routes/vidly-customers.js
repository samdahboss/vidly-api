import express from "express";
import { authorizeRole } from "../middleware/authorization.js";
import validateObjectId from "../middleware/validateId.js";
import * as customerController from "../controller/customers.js";

export const CustomersRouter = express.Router();

// Add this - handles ID validation in one place for all routes with :id
CustomersRouter.param("id", validateObjectId);

// Group routes with same path using route()
CustomersRouter.route("/")
  .get(authorizeRole(["admin"]), customerController.getAllCustomers)
  .post(customerController.createCustomer);

CustomersRouter.route("/:id")
  .get(customerController.getCustomerById)
  .put(authorizeRole(["admin"]), customerController.updateCustomer)
  .delete(authorizeRole(["admin"]), customerController.deleteCustomer);
