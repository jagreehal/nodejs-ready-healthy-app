import { logger } from '../logger';
import redis, { Redis } from 'ioredis';
import config from '../config';
import { isConnectedCheckWithTimeoutFunction } from '../utils';
import { HealthCheckResult } from '../types';

export const SERVICE_NAME = 'redis';

export function initRedis(redisClient = createRedisClient()): redis {
  connectRedis(redisClient);
  return redisClient;
}

async function connectRedis(redisClient: redis) {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Error connecting to REDIS', err);
  }
}

export async function redisHealthCheck(
  redisClient: redis
): Promise<HealthCheckResult> {
  return isConnectedCheckWithTimeoutFunction(SERVICE_NAME, async () => {
    return {
      name: SERVICE_NAME,
      status: redisClient.status === 'ready' ? 'ok' : 'error',
    };
  });
}

export function createRedisClient() {
  const redisClient = new Redis(config.REDIS_URI, {
    lazyConnect: true,
    connectTimeout: 2000,
    retryStrategy: (times) => {
      logger.info('Retrying connection to REDIS');
      return Math.min(times * 8000, 10000);
    },
  });

  redisClient.on('connect', () => {
    logger.info(`Connected to ${SERVICE_NAME}`);
  });

  redisClient.on('end', () => {
    logger.info(`Connection to ${SERVICE_NAME} ended`);
  });

  redisClient.on('close', () => {
    logger.warn(`Connection to ${SERVICE_NAME} closed`);
  });

  return redisClient;
}
