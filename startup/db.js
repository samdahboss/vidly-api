import mongoose from "mongoose";
import expressWinston from "express-winston";
import { logger } from "../middleware/logger.js";

const connectDB = () => {
  //creating a database
  mongoose.connect("mongodb://localhost:27017/GenreCollection").then(() => {
    expressWinston.logger({
      winstonInstance: logger,
      meta: true,
      msg: "Connected to mongodb successfully",
    });
  });
};

export default connectDB;
