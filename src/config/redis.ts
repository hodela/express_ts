import { createClient, RedisClientType } from 'redis';
import { logSuccess, logError } from './logger';

let redisClient: RedisClientType;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      logError(err as Error, 'Redis Client');
    });

    redisClient.on('connect', () => {
      logSuccess('Redis connected');
    });

    redisClient.on('ready', () => {
      logSuccess('Redis ready');
    });

    redisClient.on('end', () => {
      logSuccess('Redis connection ended');
    });

    await redisClient.connect();
  } catch (error) {
    logError(error as Error, 'Redis Connection');
    throw error;
  }
};

export const disconnectRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logSuccess('Redis disconnected');
    }
  } catch (error) {
    logError(error as Error, 'Redis Disconnection');
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};

export { redisClient };
