import { HttpStatus } from "../../common/enums/StatusCodes";
import { Request, Response, NextFunction } from "express";

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(HttpStatus.Forbiddden).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
};

export default apiKeyMiddleware;
