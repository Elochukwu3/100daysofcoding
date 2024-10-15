import { HttpStatus } from '../../common/enums/StatusCodes';
import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
  windowMs: 4 * 60 * 1000, // 4  minutes
  max: 3, // Limit each IP to 3 OTP requests per 5 minutes
    message: {
      status: "Too many requests",
      message: "Too many OTP requests from this IP, please try again later.",
      statusCode: HttpStatus.TooManyRequests
    },
  });



//   import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { HttpStatus } from '../../common/enums/StatusCodes';
// import redisClient from '../../common/config/redisClient'; // Ensure this is set up

// export const otpRateLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args: string[]) => redisClient.sendCommand(args),
//   }),
//   windowMs: 4 * 60 * 1000, // 4 minutes
//   max: 3, // Limit each IP to 3 OTP requests per window
//   keyGenerator: (req, res) => req.ip, // Track by IP
//   message: {
//     status: "Too many requests",
//     message: "Too many OTP requests from this IP, please try again later.",
//     statusCode: HttpStatus.TooManyRequests,
//   },
// });
