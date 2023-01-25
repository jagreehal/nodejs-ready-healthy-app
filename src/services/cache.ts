import { logger } from '../logger';
import redis, { Redis } from 'ioredis';
import config from '../config';
import { AppService, IsConnectedResult } from '../types';
import { isConnectedCheckWithTimeoutFunction } from '../utils';

let _redisClient: redis;

export const SERVICE_NAME = 'cache';

export interface Cache extends AppService {
  cache: redis;
}

async function isConnected(): Promise<IsConnectedResult> {
  return isConnectedCheckWithTimeoutFunction(SERVICE_NAME, async () => {
    const r = await _redisClient.ping();
    return {
      name: SERVICE_NAME,
      status: r === 'PONG' ? 'connected' : 'not-connected',
    };
  });
}

async function connectRedis() {
  try {
    await _redisClient.connect();
  } catch (err) {
    logger.error('Error connecting to REDIS', err);
  }
}

export function initCache(redisClient = createRedisClient()): Cache {
  _redisClient = redisClient;
  connectRedis();
  return {
    isConnected,
    cache: _redisClient,
  };
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
    logger.info('Connected to REDIS');
  });

  redisClient.on('end', () => {
    logger.info('Disconnected from REDIS');
  });

  redisClient.on('close', () => {
    logger.warn('Connection to REDIS closed');
  });

  return redisClient;
}
