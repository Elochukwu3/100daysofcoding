import "dotenv/config";
import "express-async-errors";
import "./modules/common/config/db.config";
import express, { Request, Response } from "express";
import authRoute from "./modules/auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./modules/common/config/corsOptions.config";
import morgan from "morgan";
import helmet from "helmet";
import sessionConfig from "@common/config/sessionConfig";
import connectDB from "./modules/common/config/db.config";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

connectDB();

app.use(helmet());
(() => {
  if (process.env.NODE_ENV === "test") return;

  const morganMiddleware = (() => {
    if (process.env.NODE_ENV === "development") {
      return morgan("dev");
    }

    if (process.env.NODE_ENV === "production") {
      return morgan("combined");
    }

    return null;
  })();

  if (morganMiddleware) {
    app.use(morganMiddleware);
  }
})();

app.use(sessionConfig);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});
app.use("/auth/v1", authRoute);
// app.use('/auth/v1', authRoute);

mongoose.connection.on("open", () => {
  console.log("Mongoose connected to DB");
  app.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
  // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
