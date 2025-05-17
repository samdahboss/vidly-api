import { model, Schema } from "mongoose";
import Joi from "joi";

export const validateRentals = (rentals) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(rentals);
};

const rentalsSchema = new Schema({
  customer: {
    type: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "customer",
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
      },
      phone: {
        type: Number,
        required: true,
        validate: {
          validator: function (v) {
            return v.toString().length === 13;
          },
          message: "A Phone Number should be 13 (234**********)",
        },
      },
      isGold: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
  movie: {
    type: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "movie",
        required: true,
      },
      title: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
      },
      dateOut: {
        type: Date,
        default: Date.now,
        required: true,
      },
      dateReturned: {
        type: Date,
      },
      rentalFee: {
        type: Number,
        min: 0,
        required: true,
      },
    },
    required: true,
  },
});

export const Rentals = new model("rentals", rentalsSchema);
