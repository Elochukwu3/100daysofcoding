import "dotenv/config";
import "express-async-errors";
import "./modules/common/config/passportConfig";
import express, { Request, Response } from "express";
import authRoute from "./modules/auth/routes/auth.routes";
import googleAuth from "./modules/auth/routes/google.routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import googleAuthSessionConfig from "./modules/common/config/googleSessionConfig";
import otpSessionConfig from "./modules/common/config/otpSessionConfig";
import cors from "cors";
import corsOptions from "./modules/common/config/corsOptions.config";
import morgan from "morgan";
import helmet from "helmet";
import "./modules/common/config/db.config";
// import errorHandler from "./modules/common/middlewares/errorHandler";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use(otpSessionConfig);
app.use(googleAuthSessionConfig);

app.use(passport.initialize());
app.use(passport.session());

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/auth/v1", authRoute);
app.use("/auth/v1/google", googleAuth);

// app.use(errorHandler);
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
