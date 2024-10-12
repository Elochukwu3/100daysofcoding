import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
  console.log('Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis...');
});

// Immediately connect to Redis and ensure the connection is ready
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export default redisClient;
