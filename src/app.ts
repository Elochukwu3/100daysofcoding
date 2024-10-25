import "dotenv/config";
import "express-async-errors";
import "tsconfig-paths/register";
import "express-session";
import cors from "cors";
import corsOptions from "./modules/common/config/corsOptions.config";
import stateRoute from "./modules/states/routes/states.routes";
import userRoute from "./modules/user/routes/user.route";
import productRoute from "./modules/product/routes/product.route";
import "./modules/common/config/passportConfig";
import express, { Request, Response } from "express";
import authRoute from "./modules/auth/routes/auth.routes";
import googleAuth from "./modules/auth/routes/google.routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import googleAuthSessionConfig from "./modules/common/config/googleSessionConfig";
import otpSessionConfig from "./modules/common/config/otpSessionConfig";
import cartRoute from "./modules/products/routes/cart.route";
import deliveryRoute from "./modules/delivery-add/deliveryAdd.route"

import morgan from "morgan";
import helmet from "helmet";
import "./modules/common/config/db.config";
import errorHandler from "./modules/common/middlewares/errorHandler";
// import apiKeyMiddleware from "./modules/common/middlewares/apiKey";
import path from "path";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(googleAuthSessionConfig);
app.use(otpSessionConfig);

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

morgan.token("error", (req: Request, res: Response) => {
  const error = res.locals.error || "";
  return error ? `Error: ${JSON.stringify(error)}` : "No error";
});
morgan.token("state", (req: Request, res: Response) => {
  const error = res.locals.state || "";
  return error ? `Error: ${JSON.stringify(error)}` : "No error";
});

app.use("/auth/v1/google", googleAuth);
app.use("/auth/v1", authRoute);

app.use("/api/v1", stateRoute);
app.use("/user/v1", userRoute);
app.use("/cart/v1", cartRoute);
app.use("/v1/products", productRoute);
app.use("/v1/user", deliveryRoute)

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port.. ${PORT}`);
});
