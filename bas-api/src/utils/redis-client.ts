import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } from '@bas/config';

// Khởi tạo Redis client
export const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10),
  },
  password: REDIS_PASSWORD,
  database: parseInt(REDIS_DB, 10),
});

// Kết nối Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const connectRedis = async () => {
  await redisClient.connect();
};
