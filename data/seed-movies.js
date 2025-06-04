import mongoose from "mongoose";
import { Movie } from "../models/movie.js";
import { Genre } from "../models/genre.js";
import movieArr from "./movie-data.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB Atlas
async function seedMovies() {
  try {
    // Use the same MONGODB_URI from your environment variables
    const dbUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/GenreCollection";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully");

    // Check if movies already exist
    const existingMovies = await Movie.countDocuments();
    if (existingMovies > 0) {
      console.log(`Database already has ${existingMovies} movies.`);
      console.log("Deleting existing movies...");
      await Movie.deleteMany({});
      console.log("Existing movies deleted.");
    }

    // Make sure we have genres in the database
    const genreCount = await Genre.countDocuments();
    if (genreCount === 0) {
      console.log("No genres found in database. Please seed genres first.");
      mongoose.disconnect();
      return;
    }

    // Get all genres to reference in movies
    const genres = await Genre.find();
    console.log(`Found ${genres.length} genres to use for movies`);

    // Process movie data to include proper genre references
    const moviesWithGenreIds = movieArr.map((movie) => {
      // Assuming each movie has a genreName property
      const genreNames = movie.genres.map((genre) => genre.toLowerCase());

      const movieGenres = genreNames
        .map((name) => {
          const genre = genres.find((g) => g.genre_name.toLowerCase() === name);
          return genre
            ? { _id: genre._id, genre_name: genre.genre_name }
            : null;
        })
        .filter((g) => g !== null);

      if (genreNames.includes(undefined)) {
        console.warn(`Genre not found for movie: ${movie.title}`);
      }

      return {
        ...movie,
        genres: movieGenres || null,
      };
    });

    // Insert the movies
    console.log("Inserting movies...");
    await Movie.insertMany(moviesWithGenreIds);
    console.log(`${moviesWithGenreIds.length} movies inserted successfully!`);

    // Close the connection
    mongoose.disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding movies:", error);
    mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedMovies();
