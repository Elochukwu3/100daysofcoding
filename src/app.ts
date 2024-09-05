import 'dotenv/config';
import 'express-async-errors';
import express, { Request, Response } from 'express';
import authRoute from '@auth/routes/auth.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from '@common/config/corsOptions.config'
// import connectDB from './config/dbConn';
import mongoose from 'mongoose';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
app.use('/api', authRoute);
app.listen(3000, () => {
  console.log('Server is running on port 3000, local');
});
  