import mongoose from 'mongoose'
const validateObjectId = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");
  next();
};

export default validateObjectId;
