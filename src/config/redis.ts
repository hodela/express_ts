import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

let redisClient: RedisClientType;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis ready');
    });

    redisClient.on('end', () => {
      logger.info('Redis connection ended');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

export const disconnectRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis disconnected');
    }
  } catch (error) {
    logger.error('Redis disconnection failed:', error);
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};

export { redisClient }; 