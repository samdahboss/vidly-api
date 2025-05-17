import { model, Schema } from "mongoose";
import Joi from "joi";

export const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

const customerSchema = new Schema({
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
});

export const Customer = new model("customer", customerSchema);