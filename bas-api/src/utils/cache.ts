import { redisClient } from "./redis-client";
const userCache: Record<string, { value: any; expiry: number }> = {};

// Save data to cache
export const saveToCache = async (key: string, value: any, ttl: number) => {
  try {
    console.log(`Saving data to Redis cache with key: ${key}`);
    await redisClient.set(key, JSON.stringify(value), { EX: ttl }); // TTL tính bằng giây
  } catch (error) {
    console.error('Error saving to Redis cache:', error);
  }
};

// Lấy dữ liệu từ Redis cache
export const getFromCache = async (key: string) => {
  try {
    console.log(`Retrieving data from Redis cache with key: ${key}`);
    const cachedData = await redisClient.get(key);
    if (!cachedData) {
      console.log(`No data found in Redis cache for key: ${key}`);
      return null;
    }
    console.log(`Data retrieved from Redis cache for key: ${key}`);
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error retrieving from Redis cache:', error);
    return null;
  }
};