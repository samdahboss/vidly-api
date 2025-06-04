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

  // Make sure we have genres in the database
  const genreCount = await Genre.countDocuments();
  if (genreCount === 0) {
    return res
      .status(404)
      .send("No genres found in database. Please seed genres first.");
  }

  // Get all genres to reference in movies
  const genres = await Genre.find();

  const genreNames = req.body.genres.map((genre) => genre.toLowerCase());

  const movieGenres = genreNames
    .map((name) => {
      const genre = genres.find((g) => g.genre_name.toLowerCase() === name);
      return genre ? { _id: genre._id, genre_name: genre.genre_name } : null;
    })
    .filter((g) => g !== null);

  if (movieGenres.length !== genreNames.length) {
    return res
      .status(400)
      .send("One or more genre names are invalid or not found.");
  }

  const newMovie = new Movie({
    name: req.body.name,
    description: req.body.description,
    popularity: req.body.popularity,
    genres: movieGenres,
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

  // Get all genres to reference in movies
  const genres = await Genre.find();

  const genreNames = req.body.genres.map((genre) => genre.toLowerCase());

  const movieGenres = genreNames
    .map((name) => {
      const genre = genres.find((g) => g.genre_name.toLowerCase() === name);
      return genre ? { _id: genre._id, genre_name: genre.genre_name } : null;
    })
    .filter((g) => g !== null);

  if (movieGenres.length !== genreNames.length) {
    return res
      .status(400)
      .send("One or more genre names are invalid or not found.");
  }

  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        popularity: req.body.popularity,
        genres: movieGenres,
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
