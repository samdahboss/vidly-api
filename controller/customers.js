import { validateCustomer, Customer } from "../models/customer.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  const customers = await Customer.find();
  if (!customers) return res.status(404).send("No customers Found");

  res.status(200).send(customers);
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-password -_v");

  if (!customer) {
    return res.status(404).send("The customer with the given ID was not found");
  }
  res.status(200).send(customer);
};

// Create new customer
export const createCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message);

  const newCustomer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  const result = await newCustomer.save();
  res.status(201).send(result); // Changed to 201 Created for consistency
};

// Update customer
export const updateCustomer = async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.message); // Fixed: use error.message

  const customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );

  if (!customer) {
    return res.status(404).send("The customer with the given Id was not found");
  }

  res.status(200).send(customer);
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with the given Id was not found");

  res.status(200).send(customer);
};