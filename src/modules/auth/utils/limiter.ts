import { HttpStatus } from '../../common/enums/StatusCodes';
import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 OTP requests per minute
    message: {
      status: "Too many requests",
      message: "Too many OTP requests from this IP, please try again later.",
      statusCode: HttpStatus.TooManyRequests
    },
  });