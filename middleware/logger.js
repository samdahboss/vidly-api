import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // new winston.transports.Console(), //Logging error to console
    new winston.transports.File({ filename: "logs/info.log" }), //Writing error to log file
  ],
});
