import { Schema, model } from "mongoose";

//using joi for validation
import Joi from "joi";

// function to validate genre
export const validateGenre = (genre) => {
  const schema = Joi.object({
    genre_name: Joi.string().min(5).required(),
    description: Joi.string().required(),
    popularity: Joi.number().required(),
  });
  return schema.validate(genre);
};

export const genreSchema = new Schema({
  genre_name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 5;
      },
      message: "Genre name must be more than 5 characters",
    },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Genre = new model("genres", genreSchema);
