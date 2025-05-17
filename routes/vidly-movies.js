import express from "express";
import { authorizeRole } from "../middleware/authorization.js";
import validateObjectId from "../middleware/validateId.js";
import * as movieController from "../controller/movies.js";

// Creating a router for movies
export const MoviesRouter = express.Router();

// Validate ObjectId in one place for all routes with :id parameter
MoviesRouter.param("id", validateObjectId);

// Group routes with same path using route()
MoviesRouter.route("/")
  .get(movieController.getAllMovies)
  .post(authorizeRole(["admin"]), movieController.createMovie);

MoviesRouter.route("/:id")
  .get(movieController.getMovieById)
  .put(authorizeRole(["admin"]), movieController.updateMovie)
  .delete(authorizeRole(["admin"]), movieController.deleteMovie);
