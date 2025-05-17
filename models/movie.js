import { Schema, model } from "mongoose";
import Joi from "joi";

// function to validate movie
export const validateMovie = (movie) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    description: Joi.string().required(),
    popularity: Joi.number().required(),
    genres: Joi.array().items(Joi.string()).required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  return schema.validate(movie);
};

const movieSchema = new Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    required: true,
    get: (value) => Math.round(value),
    set: (value) => Math.round(value),
  },
  genres: [
    {
      type: {
        _id: { type: Schema.Types.ObjectId, ref: "genres" },
        genre_name: { type: String, required: true },
      },
      required: true,
    },
  ],
  numberInStock: {
    type: Number,
    required: true,
    get: (value) => Math.round(value),
    set: (value) => Math.round(value),
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    get: (value) => Math.round(value),
    set: (value) => Math.round(value),
  },
  createdAt: Date,
});

//Defining the movie schema
export const Movie = new model("movie", movieSchema);
