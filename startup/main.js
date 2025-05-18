import express from "express";

import { GenreRouter } from "../routes/vidly-genres.js";
import { MoviesRouter } from "../routes/vidly-movies.js";
import { CustomersRouter } from "../routes/vidly-customers.js";
import { RentalsRouter } from "../routes/vidly-rentals.js";
import AuthRouter from "../routes/vidly-auth.js";
import UserRouter from "../routes/vidly-users.js";

import errorMiddleWare from "../middleware/error.js";

const routes = (app) => {
  app.use(express.json());

  app.use("/api/genres", GenreRouter);
  app.use("/api/movies", MoviesRouter);
  app.use("/api/customers", CustomersRouter);
  app.use("/api/rentals", RentalsRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/auth", AuthRouter);

  app.use(errorMiddleWare);
};
export default routes;
