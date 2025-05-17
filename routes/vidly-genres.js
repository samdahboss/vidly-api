import express from "express";
import { authorizeRole } from "../middleware/authorization.js";
import validateObjectId from "../middleware/validateId.js";
import * as genreController from "../controller/genre.js";

export const GenreRouter = express.Router();

GenreRouter.route("/")
  .get(genreController.getAllGenres)
  .post(authorizeRole(["admin"]), genreController.createGenre);

GenreRouter.param("id", validateObjectId);

GenreRouter.route("/:id")
  .get(genreController.getGenreById)
  .put(authorizeRole(["admin"]), genreController.updateGenre)
  .delete(authorizeRole(["admin"]), genreController.deleteGenre);
