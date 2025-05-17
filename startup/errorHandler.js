import { errorLogger } from "../middleware/errorLogger.js";
import "express-async-errors";

const handleErrors = () => {
  // Handle uncaught exceptions
  process.on("uncaughtException", (ex) => {
    errorLogger.error({
      message: ex.message,
      stack: ex.stack,
      exception: true,
      date: new Date(),
    });
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason) => {
    errorLogger.error({
      message: reason instanceof Error ? reason.message : "Unhandled Rejection",
      stack: reason instanceof Error ? reason.stack : null,
      exception: true,
      date: new Date(),
    });
    process.exit(1);
  });
};
export default handleErrors;
