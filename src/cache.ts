import { logger } from './logger';
import redis, { Redis } from 'ioredis';
import config from './config';

let _isConnected = false;

export interface Cache {
  isConnected: () => boolean;
  redisClient: redis;
}

export function isConnected() {
  return _isConnected;
}

export function initCache(redisClient = createRedisClient()): Cache {
  return {
    isConnected,
    redisClient,
  };
}

function createRedisClient() {
  const redisClient = new Redis(config.REDIS_URI, {
    lazyConnect: true,
    connectTimeout: 5000,
  });

  redisClient.connect().catch((err) => {
    logger.error('Error connecting to REDIS', err);
  });

  redisClient.on('connect', () => {
    _isConnected = true;
    logger.info('Connected to REDIS');
  });

  redisClient.on('end', () => {
    _isConnected = false;
    logger.info('Disconnected from REDIS');
  });

  redisClient.on('close', () => {
    _isConnected = false;
    logger.warn('Connection to REDIS closed');
  });

  return redisClient;
}
