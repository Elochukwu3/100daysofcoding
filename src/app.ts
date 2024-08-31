import express, { Request, Response } from 'express';
import authRoute from './modules/auth/routes/auth.routes'

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
app.use('/api', authRoute);
app.listen(3000, () => {
  console.log('Server is running on port 3000, local');
});
  