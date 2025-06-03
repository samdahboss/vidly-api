import mongoose from "mongoose";
import expressWinston from "express-winston";
import { logger } from "../middleware/logger.js";

const connectDB = () => {
  const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/GenreCollection";
  
  // Creating a database connection
  mongoose.connect(dbUri)
    .then(() => {
      expressWinston.logger({
        winstonInstance: logger,
        meta: true,
        msg: `Connected to MongoDB at ${dbUri}`,
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err.message);
      // You might want to exit the process on connection failure
      // process.exit(1);
    });
};

export default connectDB;