import { Genre, validateGenre } from "../models/genre.js";

// Get all genres
const getAllGenres = async (req, res) => {
  const genres = await Genre.find();
  if (!genres) return res.status(404).send("Genres not found");
  res.status(200).send(genres);
};

// Get genre by ID
const getGenreById = async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found");
  }
  res.status(200).send(genre);
};

// Create new genre
const createGenre = async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const newGenre = new Genre({
    genre_name: req.body.genre_name,
    description: req.body.description,
    popularity: req.body.popularity,
    createdAt: new Date(),
  });

  const result = await newGenre.save();
  res.status(201).send(result);
};

// Update genre
const updateGenre = async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        genre_name: req.body.genre_name,
        description: req.body.description,
        popularity: req.body.popularity,
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found");
  }

  res.send(genre);
};

// Delete genre
const deleteGenre = async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");
  res.status(200).send(genre);
};

export { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre };
