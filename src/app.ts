import "dotenv/config";
import "express-async-errors";
import express, { Request, Response } from "express";
import authRoute from "./modules/auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./modules/common/config/corsOptions.config";
import morgan from "morgan";
import helmet from "helmet";
import sessionConfig from "./modules/common/config/sessionConfig";
import  "./modules/common/config/db.config";
import errorHandler from "./modules/common/middlewares/errorHandler";
import apiKeyMiddleware from "./modules/common/middlewares/apiKey";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));


app.use(sessionConfig);

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

app.use("/auth/v1",apiKeyMiddleware, authRoute);

app.use(errorHandler)
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});