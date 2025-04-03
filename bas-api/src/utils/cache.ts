import { redisClient } from './redis-client';
const userCache: Record<string, { value: any; expiry: number }> = {};

export const saveToCache = async (key: string, value: any, ttl: number) => {
  try {
    console.log(`Saving data to Redis cache with key: ${key}`);
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (error) {
    console.error('Error saving to Redis cache:', error);
  }
};

export const getFromCache = async (key: string) => {
  try {
    console.log(`Retrieving data from Redis cache with key: ${key}`);
    const cachedData = await redisClient.get(key);
    if (!cachedData) {
      console.log(`No data found in Redis cache for key: ${key}`);
      return null;
    }
    console.log(`Data retrieved from Redis cache for key: ${key}`);
    // The data is already a JSON string, just parse it once
    const parsedData = JSON.parse(cachedData);
    // console.log('Cached value:', JSON.stringify(parsedData, null, 2));
    return parsedData;
  } catch (error) {
    console.error('Error retrieving from Redis cache:', error);
    return null;
  }
};
