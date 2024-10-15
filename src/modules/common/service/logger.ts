import winston from 'winston';

export const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log' }),
      new winston.transports.Console()
    ],
  });
  