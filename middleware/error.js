import { errorLogger } from "./errorLogger.js";

const errorMiddleWare = async (err, req, res, next) => {
  // Log directly with your custom logger
  errorLogger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  res.status(500).send("Something failed: " + err.message);
};

export default errorMiddleWare;
