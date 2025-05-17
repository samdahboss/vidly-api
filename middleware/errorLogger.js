import winston from "winston";
import "winston-mongodb"; // Import the MongoDB transport

// Custom format to properly handle Error objects
const errorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
      // Spread any additional properties
      ...info
    };
  }
  
  // If the error is in the meta object
  if (info.meta && info.meta instanceof Error) {
    info.message = info.meta.message;
    info.stack = info.meta.stack;
  }
  
  return info;
});

export const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    errorFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    //Console transport
    new winston.transports.Console(), 

    // File transport
    new winston.transports.File({ filename: "logs/error.log" }),
    
    // MongoDB transport (new)
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/GenreCollection",
      collection: "logs",
      level: "error",
      options: { useUnifiedTopology: true },
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/GenreCollection",
      collection: "exceptions",
      options: { useUnifiedTopology: true },
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/GenreCollection",
      collection: "rejections",
      options: { useUnifiedTopology: true },
    })
  ]
});