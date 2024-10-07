import "dotenv/config";
import "express-async-errors";
import 'tsconfig-paths/register';
import 'express-session'
import express, { Request, Response } from "express";
import authRoute from "@auth/routes/auth.routes";
import stateRoute from "@states/routes/states.routes";
import userRoute from "@user/routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "@common/config/corsOptions.config";
import morgan from "morgan";
import helmet from "helmet";
import sessionConfig from "@common/config/sessionConfig";
import  "@common/config/db.config";
import errorHandler from "@common/middlewares/errorHandler";
import apiKeyMiddleware from "@common/middlewares/apiKey";
import path from "path";
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


morgan.token('error', (req: Request, res: Response) => {
  const error = res.locals.error || '';
  return error ? `Error: ${JSON.stringify(error)}` : 'No error';
});
morgan.token('state', (req: Request, res: Response) => {
  const error = res.locals.state || '';
  return error ? `Error: ${JSON.stringify(error)}` : 'No error';
});


// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript with Express!");
// });

app.use("/auth/v1",apiKeyMiddleware, authRoute);
app.use("/api/v1", stateRoute)
app.use("/user/v1", userRoute);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})


app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on port.. ${PORT}`);
});