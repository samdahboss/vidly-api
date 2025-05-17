import { Rentals, validateRentals } from "../models/rentals.js";
import { Customer } from "../models/customer.js";
import { Movie } from "../models/movie.js";
import mongoose from "mongoose";

// Get all rentals
export const getAllRentals = async (req, res) => {
  const result = await Rentals.find();
  if (!result) return res.status(404).send("No Rentals Found");
  res.status(200).send(result);
};

// Get rental by ID
export const getRentalById = async (req, res) => {
  const rental = await Rentals.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");
  res.status(200).send(rental);
};

// Create new rental
export const createRental = async (req, res) => {
  const { error } = validateRentals(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customerId = req.body.customerId;
  const movieId = req.body.movieId;

  const isValidId = (id) => mongoose.isValidObjectId(id);

  if (!isValidId(customerId) || !isValidId(movieId)) {
    return res.status(400).send("Invalid Customer or Movie Id");
  }

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).send("Movie not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");

  const newRental = new Rentals({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.name,
      dailyRentalRate: movie.dailyRentalRate,
      dateOut: Date.now(),
      dateReturned: movie.dateReturned,
      rentalFee: movie.dailyRentalRate * 5, //simulating 5days
    },
  });

  const result = await newRental.save();

  // Fixed: await the save operation
  movie.numberInStock--;
  await movie.save();

  res.status(201).send(result); // Changed to 201 Created
};

// Return a rental (new endpoint)
export const returnRental = async (req, res) => {
  const rental = await Rentals.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.movie.dateReturned) 
    return res.status(400).send("Rental already returned");

  // Set return date
  rental.movie.dateReturned = Date.now();
  
  // Calculate actual rental fee based on days
  const rentalDays = Math.round((rental.movie.dateReturned - rental.movie.dateOut) / (1000 * 60 * 60 * 24));
  rental.movie.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  
  await rental.save();

  // Increase movie stock
  const movie = await Movie.findById(rental.movie._id);
  if (movie) {
    movie.numberInStock++;
    await movie.save();
  }

  res.status(200).send(rental);
};

// Delete rental
export const deleteRental = async (req, res) => {
  const rental = await Rentals.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).send("Rental not found");
  res.status(200).send(rental);
};