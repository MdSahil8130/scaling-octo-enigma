import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express, { Express } from "express";
import morgan from "morgan";
// extra security
// const helmet = require('helmet');
// const xss = require('xss-clean');
import cors from "cors";
import rateLimiter from "express-rate-limit";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(morgan("dev"));

// connectDB
import connectDB from "./db/connect";
// const authenticateUser = require("./middleware/authentication");

// // routers
import authRouter from "./routes/auth";

// // error handler
import notFoundMiddleware from "./middleware/not-found";
import errorHandlerMiddleware from "./middleware/error-handler";

app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 300,
  }),
);

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin: string | undefined, callback: any) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    optionsSuccessStatus: 204,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
// extra packages
// app.use(helmet());
// app.use(cors());
// app.use(xss());

// routes
app.use("/", express.static("../client/dist"));
app.use("/api/v1/auth", authRouter);

app.use("*", express.static("../client/dist/index.html"));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (typeof mongoUri === "undefined") {
      console.log("MONGO_URI not provided");
      console.log("exiting");
      return;
    }
    await connectDB(mongoUri);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
