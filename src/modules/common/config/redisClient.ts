import { createClient } from 'redis';
import { logger } from '../../common/service/logger';

const redisClient = createClient(
  {    password: process.env.REDIS_CLIENT_SECRET_KEY,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT as unknown as number 
    }}
);


const maxRetries = 5;
let retryAttempts = 0;

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis...');
  } catch (err) {
    retryAttempts += 1;
    if (err instanceof Error) {
      logger.error(`Error connecting to Redis: ${err.message}`);
      process.exit(1);
    } else {
      logger.error(`Unknown error: ${JSON.stringify(err)}`);
    }
    
    if (retryAttempts < maxRetries) {
      logger.info(`Retrying Redis connection... Attempt ${retryAttempts}`);
      setTimeout(connectToRedis, 5000); 
    } else {
      logger.error('Max retries reached. Could not connect to Redis.');
    }
  }
};


redisClient.on('error', (err) => {
  logger.error(`Redis Error: ${err.message}`);
  process.exit(1);
});


connectToRedis();

export default redisClient;
