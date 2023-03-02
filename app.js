require("dotenv").config();
require("express-async-errors");
const express = require("express");
//security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const connectDB = require("./db/connect");

// routes
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const { isAuth } = require("./middleware/authentication");

const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//* express.json :: parse incoming request with JSON payloads
app.use(express.json());
//* cors :: make sure our api is accessible to other domains
app.use(cors());
//* Helmet :: helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
//* xss-clean :: prevent xss attacks
app.use(xss());
//* rate-limit :: limit repeated requests to public APIs and/or endpoints
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// routes
app.use(`/api/${process.env.API_VERSION || "v1"}/auth`, authRouter);
app.use(`/api/${process.env.API_VERSION || "v1"}/jobs`, isAuth, jobsRouter);

//error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
