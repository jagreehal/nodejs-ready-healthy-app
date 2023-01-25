import { MongoClient } from 'mongodb';
import config from '../config';
import { logger } from '../logger';
import { HealthCheckResult } from '../types';
import { isConnectedCheckWithTimeoutFunction } from '../utils';

export const SERVICE_NAME = 'mongo';

async function connectMongo(mongoClient: MongoClient, retryAttempt = 1) {
  try {
    await mongoClient.connect();
    logger.info('Connected to MONGO');
  } catch (err) {
    logger.error('Error connecting to MONGO', err);
    setTimeout(() => {
      connectMongo(mongoClient, retryAttempt + 1);
    }, Math.min(1000, 200 * retryAttempt));
  }
}

export function initMongo(mongoClient = createMongoClient()): MongoClient {
  connectMongo(mongoClient);
  return mongoClient;
}

export function createMongoClient() {
  const mongoClient = new MongoClient(config.MONGODB_URI, {
    connectTimeoutMS: 2000,
  });
  return mongoClient;
}

export async function mongoHealthCheck(
  mongoClient: MongoClient
): Promise<HealthCheckResult> {
  return isConnectedCheckWithTimeoutFunction(SERVICE_NAME, async () => {
    const r = await mongoClient.db().command({ ping: 1 });
    return {
      name: SERVICE_NAME,
      status: r.ok === 1 ? 'ok' : 'error',
    };
  });
}
