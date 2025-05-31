import express from "express";

import routes from "./startup/main.js";
import connectDB from "./startup/db.js";
import handleErrors from "./startup/errorHandler.js";
import checkConfig from "./startup/config.js";

const app = express();

handleErrors();
routes(app);
connectDB();
checkConfig();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
