import express from "express";
import validateObjectId from "../middleware/validateId.js";
import { authorize, authorizeRole } from "../middleware/authorization.js";
import * as rentalController from "../controller/rentals.js";

export const RentalsRouter = express.Router();

// Validate ObjectId in one place for all routes with :id parameter
RentalsRouter.param("id", validateObjectId);

// Group routes with same path using route()
RentalsRouter.route("/")
  .get(authorizeRole(["admin"]), rentalController.getAllRentals)
  .post(authorize, rentalController.createRental);

RentalsRouter.route("/:id")
  .get(authorize, rentalController.getRentalById)
  .delete(authorizeRole(["admin"]), rentalController.deleteRental);

// Special route for returning rentals
RentalsRouter.patch("/:id/return", authorize, rentalController.returnRental);