import { Movie, validateMovie } from "../models/movie.js";
import { Genre } from "../models/genre.js";
import mongoose from "mongoose";

// Get all movies
export const getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  if (!movies) return res.status(404).send("No Movies Found");
  res.status(200).send(movies);
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found");
  res.status(200).send(movie);
};

// Create new movie
export const createMovie = async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate each genre ID
  const invalidIds = req.body.genres.filter(
    (id) => !mongoose.isValidObjectId(id)
  );
  if (invalidIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid genre ID(s): ${invalidIds.join(", ")}`);
  }

  const movieGenres = await Genre.find({
    _id: { $in: req.body.genres },
  });

  if (movieGenres.length !== req.body.genres.length) {
    return res.status(400).send("One or more genre IDs are invalid.");
  }

  const storedGenreFormat = movieGenres.map((genre) => ({
    _id: genre._id,
    genre_name: genre.genre_name,
  }));

  const newMovie = new Movie({
    name: req.body.name,
    description: req.body.description,
    popularity: req.body.popularity,
    genres: storedGenreFormat,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    createdAt: new Date(),
  });

  const response = await newMovie.save();
  res.status(201).send(response); // Changed to 201 Created
};

// Update movie
export const updateMovie = async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate each genre ID
  const invalidIds = req.body.genres.filter(
    (id) => !mongoose.isValidObjectId(id)
  );
  if (invalidIds.length > 0) {
    return res
      .status(400)
      .send(`Invalid genre ID(s): ${invalidIds.join(", ")}`);
  }

  const movieGenres = await Genre.find({
    _id: { $in: req.body.genres },
  });

  if (movieGenres.length !== req.body.genres.length) {
    return res.status(400).send("One or more genre IDs are invalid.");
  }

  const storedGenreFormat = movieGenres.map((genre) => ({
    _id: genre._id,
    genre_name: genre.genre_name,
  }));

  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        popularity: req.body.popularity,
        genres: storedGenreFormat,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        updatedAt: new Date(), // Changed from createdAt to updatedAt
      },
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("Movie not found");
  res.status(200).send(movie);
};

// Delete movie
export const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("The given movie ID was not found.");
  res.status(200).send(movie);
};